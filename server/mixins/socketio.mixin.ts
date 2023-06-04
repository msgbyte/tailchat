import { Server as SocketServer } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { instrument } from '@socket.io/admin-ui';
import RedisClient from 'ioredis';
import {
  TcService,
  TcContext,
  UserJWTPayload,
  parseLanguageFromHead,
  config,
  PureContext,
  PureService,
  PureServiceSchema,
  Utils,
  Errors,
} from 'tailchat-server-sdk';
import _ from 'lodash';
import { ServiceUnavailableError } from 'tailchat-server-sdk';
import { isValidStr } from '../lib/utils';
import bcrypt from 'bcryptjs';
import msgpackParser from 'socket.io-msgpack-parser';

const blacklist: (string | RegExp)[] = ['gateway.*'];

function checkBlacklist(eventName: string): boolean {
  return blacklist.some((item) => {
    if (_.isString(item)) {
      return Utils.match(eventName, item);
    } else if (_.isRegExp(item)) {
      return item.test(eventName);
    }
  });
}

/**
 * socket 用户房间编号
 */
function buildUserRoomId(userId: string) {
  return `u-${userId}`;
}

/**
 * socket online 用户编号
 */
function buildUserOnlineKey(userId: string) {
  return `tailchat-socketio.online:${userId}`;
}

const expiredTime = 1 * 24 * 60 * 60; // 1天

interface SocketIOService extends PureService {
  io: SocketServer;
  redis: RedisClient.Redis;
  socketCloseCallbacks: (() => Promise<unknown>)[];
}

interface TcSocketIOServiceOptions {
  /**
   * 用户token校验
   */
  userAuth: (token: string) => Promise<UserJWTPayload>;
}

/**
 * Socket IO 服务 mixin
 */
export const TcSocketIOService = (
  options: TcSocketIOServiceOptions
): Partial<PureServiceSchema> => {
  const { userAuth } = options;

  const schema: Partial<PureServiceSchema> = {
    created(this: SocketIOService) {
      this.broker.metrics.register({
        type: 'gauge',
        name: 'tailchat.socketio.online.count',
        labelNames: ['nodeId'],
        description: 'Number of online user',
      });
    },
    async started(this: SocketIOService) {
      if (!this.io) {
        this.initSocketIO();
      }

      this.logger.info('SocketIO 服务已启动');

      const io: SocketServer = this.io;
      if (!config.redisUrl) {
        throw new Errors.MoleculerClientError(
          'SocketIO服务启动失败, 需要环境变量: process.env.REDIS_URL'
        );
      }
      this.socketCloseCallbacks = []; // socketio服务关闭时需要执行的回调

      const pubClient = new RedisClient(config.redisUrl, {
        retryStrategy(times) {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      });
      const subClient = pubClient.duplicate();
      io.adapter(
        createAdapter(pubClient, subClient, {
          key: 'tailchat-socket',
        })
      );

      this.socketCloseCallbacks.push(async () => {
        pubClient.disconnect(false);
        subClient.disconnect(false);
      });
      this.logger.info('SocketIO 正在使用 Redis Adapter');

      this.redis = pubClient;

      io.use(async (socket, next) => {
        // 授权
        try {
          if (
            config.enableSocketAdmin &&
            socket.handshake.headers['origin'] === 'https://admin.socket.io'
          ) {
            // 如果是通过 admin-ui 访问的socket.io 直接链接
            next();
            return;
          }

          const token = socket.handshake.auth['token'];
          if (typeof token !== 'string') {
            throw new Errors.MoleculerError('Token不能为空');
          }

          const user: UserJWTPayload = await userAuth(token);

          if (!(user && user._id)) {
            throw new Error('Token不合规');
          }

          this.logger.info('[Socket] Authenticated via JWT: ', user.nickname);

          socket.data.user = user;
          socket.data.token = token;
          socket.data.userId = user._id;

          next();
        } catch (e) {
          return next(e);
        }
      });

      this.io.on('connection', (socket) => {
        if (typeof socket.data.userId !== 'string') {
          // 不应该进入的逻辑
          return;
        }

        this.broker.metrics.increment(
          'tailchat.socketio.online.count',
          {
            nodeId: this.broker.nodeID,
          },
          1
        );

        const userId = socket.data.userId;
        pubClient
          .hset(buildUserOnlineKey(userId), socket.id, this.broker.nodeID)
          .then(() => {
            pubClient.expire(buildUserOnlineKey(userId), expiredTime);
          });

        // 加入自己userId所生产的id
        socket.join(buildUserRoomId(userId));

        /**
         * 离线时移除在线映射
         */
        const removeOnlineMapping = () => {
          return pubClient.hdel(buildUserOnlineKey(userId), socket.id);
        };
        this.socketCloseCallbacks.push(removeOnlineMapping);

        // 用户断线
        socket.on('disconnecting', (reason) => {
          this.logger.info(
            'Socket Disconnect:',
            reason,
            '| Rooms:',
            socket.rooms
          );

          this.broker.metrics.decrement(
            'tailchat.socketio.online.count',
            {
              nodeId: this.broker.nodeID,
            },
            1
          );

          removeOnlineMapping();
          _.pull(this.socketCloseCallbacks, removeOnlineMapping);
        });

        // 连接时
        socket.onAny(
          async (
            eventName: string,
            eventData: unknown,
            cb: (data: unknown) => void
          ) => {
            this.logger.info(
              '[SocketIO]',
              eventName,
              '<=',
              JSON.stringify(eventData)
            );

            // 检测是否允许调用
            if (checkBlacklist(eventName)) {
              const message = '不允许的请求';
              this.logger.warn('[SocketIO]', '=>', message);
              cb({
                result: false,
                message,
              });
              return;
            }

            // 接受任意消息, 并调用action
            try {
              const endpoint = this.broker.findNextActionEndpoint(eventName);
              if (endpoint instanceof Error) {
                if (endpoint instanceof Errors.ServiceNotFoundError) {
                  throw new ServiceUnavailableError();
                }

                throw endpoint;
              }

              if (
                typeof endpoint.action.visibility === 'string' &&
                endpoint.action.visibility !== 'published'
              ) {
                throw new Errors.ServiceNotFoundError({
                  visibility: endpoint.action.visibility,
                  action: eventName,
                });
              }

              if (endpoint.action.disableSocket === true) {
                throw new Errors.ServiceNotFoundError({
                  disableSocket: true,
                  action: eventName,
                });
              }

              /**
               * TODO:
               * 这里也许还可以被优化？看molecular的源码好像没有走远程调用这一步，但是没看懂如何实现的
               * 需要研究一下
               */
              const language = parseLanguageFromHead(
                socket.handshake.headers['accept-language']
              );
              const data = await this.broker.call(eventName, eventData, {
                meta: {
                  ...socket.data,
                  socketId: socket.id,
                  language,
                },
              });

              if (typeof cb === 'function') {
                this.logger.debug(
                  '[SocketIO]',
                  eventName,
                  '=>',
                  JSON.stringify(data)
                );
                cb({ result: true, data });
              }
            } catch (err: unknown) {
              const message = _.get(err, 'message', '服务器异常');
              this.logger.debug('[SocketIO]', eventName, '=>', message);
              this.logger.error('[SocketIO]', err);
              cb({
                result: false,
                message,
              });
            }
          }
        );
      });
    },
    async stopped(this: SocketIOService) {
      if (this.io) {
        this.io.close();
        await Promise.all(this.socketCloseCallbacks.map((fn) => fn()));
      }
      this.logger.info('断开所有连接');
    },
    actions: {
      joinRoom: {
        visibility: 'public',
        params: {
          roomIds: 'array',
          userId: [{ type: 'string', optional: true }], // 可选, 如果不填则为当前socket的id
        },
        async handler(
          this: TcService,
          ctx: TcContext<{ roomIds: string[]; userId?: string }>
        ) {
          const roomIds = ctx.params.roomIds;
          const userId = ctx.params.userId;
          const searchId = isValidStr(userId)
            ? buildUserRoomId(userId)
            : ctx.meta.socketId;
          if (typeof searchId !== 'string') {
            throw new Error('无法加入房间, 查询条件不合法, 请联系管理员');
          }

          if (!Array.isArray(roomIds)) {
            throw new Error('无法加入房间, 参数必须为数组');
          }

          // 获取远程socket链接并加入
          const io: SocketServer = this.io;
          const remoteSockets = await io.in(searchId).fetchSockets();
          if (remoteSockets.length === 0) {
            this.logger.warn('无法加入房间, 无法找到当前socket链接:', searchId);
            return;
          }

          remoteSockets.forEach((rs) =>
            rs.join(
              roomIds.map(String) // 强制确保roomId为字符串，防止出现传个objectId类型的数据过来
            )
          );
        },
      },
      leaveRoom: {
        visibility: 'public',
        params: {
          roomIds: 'array',
          userId: [{ type: 'string', optional: true }],
        },
        async handler(
          this: TcService,
          ctx: TcContext<{ roomIds: string[]; userId?: string }>
        ) {
          const roomIds = ctx.params.roomIds;
          const userId = ctx.params.userId;
          const searchId = isValidStr(userId)
            ? buildUserRoomId(userId)
            : ctx.meta.socketId;
          if (typeof searchId !== 'string') {
            this.logger.error('无法离开房间, 当前socket链接不存在');
            return;
          }

          // 获取远程socket链接并离开
          const io: SocketServer = this.io;
          const remoteSockets = await io.in(searchId).fetchSockets();
          if (remoteSockets.length === 0) {
            this.logger.error('无法离开房间, 无法找到当前socket链接');
            return;
          }

          remoteSockets.forEach((rs) => {
            roomIds.forEach((roomId) => {
              rs.leave(roomId);
            });
          });
        },
      },

      /**
       * 根据userId获取所有的用户链接
       */
      fetchUserSocketIds: {
        visibility: 'public',
        params: {
          userId: 'string',
        },
        async handler(
          this: TcService,
          ctx: TcContext<{ userId: string }>
        ): Promise<string[]> {
          const userId = ctx.params.userId;
          const io: SocketServer = this.io;
          const remoteSockets = await io
            .in(buildUserRoomId(userId))
            .fetchSockets();

          return remoteSockets.map((remoteSocket) => remoteSocket.id);
        },
      },

      /**
       * 获取userId获取所有的用户的token
       */
      getUserSocketToken: {
        visibility: 'public',
        params: {
          userId: 'string',
        },
        async handler(
          this: TcService,
          ctx: TcContext<{ userId: string }>
        ): Promise<string[]> {
          const userId = ctx.params.userId;
          const io: SocketServer = this.io;
          const remoteSockets = await io
            .in(buildUserRoomId(userId))
            .fetchSockets();

          return remoteSockets.map((remoteSocket) => remoteSocket.data.token);
        },
      },

      /**
       * 踢出用户
       */
      tickUser: {
        visibility: 'public',
        params: {
          userId: 'string',
        },
        async handler(this: TcService, ctx: TcContext<{ userId: string }>) {
          const userId = ctx.params.userId;
          const io: SocketServer = this.io;
          const remoteSockets = await io
            .in(buildUserRoomId(userId))
            .fetchSockets();

          remoteSockets.forEach((remoteSocket) => {
            remoteSocket.disconnect(true);
          });
        },
      },

      /**
       * 服务端通知
       */
      notify: {
        visibility: 'public',
        params: {
          type: 'string',
          target: [
            { type: 'string', optional: true },
            { type: 'array', optional: true },
          ],
          eventName: 'string',
          eventData: 'any',
        },
        handler(
          this: TcService,
          ctx: PureContext<{
            type: string;
            target: string | string[];
            eventName: string;
            eventData: any;
          }>
        ) {
          const { type, target, eventName, eventData } = ctx.params;
          const io: SocketServer = this.io;
          if (type === 'unicast' && typeof target === 'string') {
            // 单播
            io.to(buildUserRoomId(target)).emit(eventName, eventData);
          } else if (type === 'listcast' && Array.isArray(target)) {
            // 列播
            io.to(target.map((t) => buildUserRoomId(t))).emit(
              eventName,
              eventData
            );
          } else if (type === 'roomcast') {
            // 组播
            io.to(target).emit(eventName, eventData);
          } else if (type === 'broadcast') {
            // 广播
            io.emit(eventName, eventData);
          } else {
            this.logger.warn(
              '[SocketIO]',
              'Unknown notify type or target',
              type,
              target
            );
          }
        },
      },

      /**
       * 检查用户在线状态
       */
      checkUserOnline: {
        params: {
          userIds: 'array',
        },
        async handler(
          this: TcService,
          ctx: PureContext<{ userIds: string[] }>
        ) {
          const userIds = ctx.params.userIds;

          const status = await Promise.all(
            userIds.map((userId) =>
              (this.redis as RedisClient.Redis).exists(
                buildUserOnlineKey(userId)
              )
            )
          );

          return status.map((d) => Boolean(d));
        },
      },
    },
    methods: {
      initSocketIO() {
        if (!this.server) {
          throw new Errors.ServiceNotAvailableError(
            '需要和 [ApiGatewayMixin] 一起使用'
          );
        }
        this.io = new SocketServer(this.server, {
          serveClient: false,
          transports: ['websocket'],
          cors: {
            origin: '*',
            methods: ['GET', 'POST'],
          },
          parser: msgpackParser,
        });

        if (
          isValidStr(process.env.ADMIN_USER) &&
          isValidStr(process.env.ADMIN_PASS)
        ) {
          this.logger.info('****************************************');
          this.logger.info(`检测到Admin管理已开启`);
          this.logger.info('****************************************');

          instrument(this.io, {
            auth: {
              type: 'basic',
              username: process.env.ADMIN_USER,
              password: bcrypt.hashSync(process.env.ADMIN_PASS, 10),
            },
          });
        }
      },
    },
  };

  return schema;
};
