import type { IncomingMessage, ServerResponse } from 'http';
import _ from 'lodash';
import { TcSocketIOService } from '../../mixins/socketio.mixin';
import {
  TcService,
  UserJWTPayload,
  config,
  t,
  parseLanguageFromHead,
  builtinAuthWhitelist,
  PureContext,
  ApiGatewayMixin,
  ApiGatewayErrors,
} from 'tailchat-server-sdk';
import { TcHealth } from '../../mixins/health.mixin';
import type { Readable } from 'stream';
import { checkPathMatch } from '../../lib/utils';
import serve from 'serve-static';
import accepts from 'accepts';
import send from 'send';

export default class ApiService extends TcService {
  authWhitelist = [];

  get serviceName() {
    return 'gateway';
  }

  onInit() {
    this.registerMixin(ApiGatewayMixin);
    this.registerMixin(
      TcSocketIOService({
        userAuth: async (token) => {
          const user: UserJWTPayload = await this.broker.call(
            'user.resolveToken',
            {
              token,
            }
          );

          return user;
        },
      })
    );
    this.registerMixin(TcHealth());

    // More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
    this.registerSetting('port', config.port);
    this.registerSetting('routes', this.getRoutes());
    // Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
    this.registerSetting('log4XXResponses', false);
    // Logging the request parameters. Set to any log level to enable it. E.g. "info"
    this.registerSetting('logRequestParams', null);
    // Logging the response data. Set to any log level to enable it. E.g. "info"
    this.registerSetting('logResponseData', null);
    // Serve assets from "public" folder
    // this.registerSetting('assets', {
    //   folder: 'public',
    //   // Options to `server-static` module
    //   options: {},
    // });
    this.registerSetting('cors', {
      // Configures the Access-Control-Allow-Origin CORS header.
      origin: '*',
      // Configures the Access-Control-Allow-Methods CORS header.
      methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
      // Configures the Access-Control-Allow-Headers CORS header.
      allowedHeaders: ['X-Token', 'Content-Type'],
      // Configures the Access-Control-Expose-Headers CORS header.
      exposedHeaders: [],
      // Configures the Access-Control-Allow-Credentials CORS header.
      credentials: false,
      // Configures the Access-Control-Max-Age CORS header.
      maxAge: 3600,
    });
    // this.registerSetting('rateLimit', {
    //   // How long to keep record of requests in memory (in milliseconds).
    //   // Defaults to 60000 (1 min)
    //   window: 60 * 1000,

    //   // Max number of requests during window. Defaults to 30
    //   limit: 30,

    //   // Set rate limit headers to response. Defaults to false
    //   headers: true,

    //   // Function used to generate keys. Defaults to:
    //   key: (req) => {
    //     return (
    //       req.headers['x-forwarded-for'] ||
    //       req.connection.remoteAddress ||
    //       req.socket.remoteAddress ||
    //       req.connection.socket.remoteAddress
    //     );
    //   },
    // });

    this.registerMethod('authorize', this.authorize);

    this.registerEventListener(
      'gateway.auth.addWhitelists',
      ({ urls = [] }) => {
        this.logger.info('Add auth whitelist:', urls);
        this.authWhitelist.push(...urls);
      }
    );
  }

  getRoutes() {
    return [
      // /api
      {
        path: '/api',
        whitelist: [
          // Access to any actions in all services under "/api" URL
          '**',
        ],
        // Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
        use: [],
        // Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
        mergeParams: true,

        // Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
        authentication: false,

        // Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
        authorization: true,

        // The auto-alias feature allows you to declare your route alias directly in your services.
        // The gateway will dynamically build the full routes from service schema.
        autoAliases: true,

        aliases: {},
        /**
         * Before call hook. You can check the request.
         * @param {PureContext} ctx
         * @param {Object} route
         * @param {IncomingMessage} req
         * @param {ServerResponse} res
         * @param {Object} data*/
        onBeforeCall(
          ctx: PureContext<any, { userAgent: string; language: string }>,
          route: object,
          req: IncomingMessage,
          res: ServerResponse
        ) {
          // Set request headers to context meta
          ctx.meta.userAgent = req.headers['user-agent'];
          ctx.meta.language = parseLanguageFromHead(
            req.headers['accept-language']
          );
        },

        /**
         * After call hook. You can modify the data.
         * @param {PureContext} ctx
         * @param {Object} route
         * @param {IncomingMessage} req
         * @param {ServerResponse} res
         * @param {Object} data
         *
         */
        onAfterCall(
          ctx: PureContext,
          route: object,
          req: IncomingMessage,
          res: ServerResponse,
          data: object
        ) {
          // Async function which return with Promise
          res.setHeader('X-Node-ID', ctx.nodeID);

          if (data && data['__raw']) {
            // 如果返回值有__raw, 则视为返回了html片段
            if (data['header']) {
              Object.entries(data['header']).forEach(([key, value]) => {
                res.setHeader(key, String(value));
              });
            }

            res.write(data['html'] ?? '');
            res.end();
            return;
          }

          return { code: res.statusCode, data };
        },

        // Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
        callingOptions: {},

        bodyParsers: {
          json: {
            strict: false,
            limit: '1MB',
          },
          urlencoded: {
            extended: true,
            limit: '1MB',
          },
        },

        // Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
        mappingPolicy: 'all', // Available values: "all", "restrict"

        // Enable/disable logging
        logging: true,
      },
      // /upload
      {
        // Reference: https://github.com/moleculerjs/moleculer-web/blob/master/examples/file/index.js
        path: '/upload',
        // You should disable body parsers
        bodyParsers: {
          json: false,
          urlencoded: false,
        },

        authentication: false,
        authorization: true,

        aliases: {
          // File upload from HTML form
          'POST /': {
            type: 'multipart',
            action: 'file.save',
          },

          // File upload from AJAX or cURL
          'PUT /': {
            type: 'stream',
            action: 'file.save',
          },
        },

        // https://github.com/mscdex/busboy#busboy-methods
        busboyConfig: {
          limits: {
            files: 1,
            fileSize: config.storage.limit,
          },
          onPartsLimit(busboy, alias, svc) {
            this.logger.info('Busboy parts limit!', busboy);
          },
          onFilesLimit(busboy, alias, svc) {
            this.logger.info('Busboy file limit!', busboy);
          },
          onFieldsLimit(busboy, alias, svc) {
            this.logger.info('Busboy fields limit!', busboy);
          },
        },

        callOptions: {
          meta: {
            a: 5,
          },
        },

        mappingPolicy: 'restrict',
      },
      // /health
      {
        path: '/health',
        aliases: {
          'GET /': 'gateway.health',
        },
        mappingPolicy: 'restrict',
      },
      // /static 对象存储文件代理
      {
        path: '/static',
        authentication: false,
        authorization: false,
        aliases: {
          async 'GET /:objectName+'(
            this: TcService,
            req: IncomingMessage,
            res: ServerResponse
          ) {
            const arr: string[] = _.get(req, '$params.objectName') ?? [];
            const objectName = arr.join('/');

            try {
              const result: Readable = await this.broker.call(
                'file.get',
                {
                  objectName,
                },
                {
                  parentCtx: _.get(req, '$ctx'),
                }
              );
              result.pipe(res);
            } catch (err) {
              this.logger.error(err);
              res.write('static file not found');
              res.end();
            }
          },
        },
        mappingPolicy: 'restrict',
      },
      // 静态文件代理
      {
        path: '/',
        authentication: false,
        authorization: false,
        use: [
          serve('public', {
            setHeaders(res: ServerResponse, path: string, stat: any) {
              res.setHeader('Access-Control-Allow-Origin', '*'); // 允许跨域
            },
          }),
        ],
        onError(req: IncomingMessage, res: ServerResponse, err) {
          if (
            String(req.method).toLowerCase() === 'get' && // get请求
            accepts(req).types(['html']) && // 且请求html页面
            err.code === 404
          ) {
            // 如果没有找到, 则返回index.html(for spa)
            this.logger.info('fallback to fe entry file');
            send(req, './public/index.html', { root: process.cwd() }).pipe(res);
          }
        },
        whitelist: [],
        autoAliases: false,
      },
    ];
  }

  /**
   * 获取鉴权白名单
   * 在白名单中的路由会被跳过
   */
  getAuthWhitelist() {
    return _.uniq([...builtinAuthWhitelist, ...this.authWhitelist]);
  }

  /**
   * jwt秘钥
   */
  get jwtSecretKey() {
    return config.secret;
  }

  async authorize(
    ctx: PureContext<{}, any>,
    route: unknown,
    req: IncomingMessage
  ) {
    if (checkPathMatch(this.getAuthWhitelist(), req.url)) {
      return null;
    }

    const token = req.headers['x-token'] as string;

    if (typeof token !== 'string') {
      throw new ApiGatewayErrors.UnAuthorizedError(
        ApiGatewayErrors.ERR_NO_TOKEN,
        {
          error: 'No Token',
        }
      );
    }

    // Verify JWT token
    try {
      const user: UserJWTPayload = await ctx.call('user.resolveToken', {
        token,
      });

      if (user && user._id) {
        this.logger.info('[Web] Authenticated via JWT: ', user.nickname);
        // Reduce user fields (it will be transferred to other nodes)
        ctx.meta.user = _.pick(user, ['_id', 'nickname', 'email', 'avatar']);
        ctx.meta.token = token;
        ctx.meta.userId = user._id;
      } else {
        throw new Error(t('Token不合规'));
      }
    } catch (err) {
      throw new ApiGatewayErrors.UnAuthorizedError(
        ApiGatewayErrors.ERR_INVALID_TOKEN,
        {
          error: 'Invalid Token:' + String(err),
        }
      );
    }
  }
}
