import { io, Socket } from 'socket.io-client';
import _isNil from 'lodash/isNil';
import { getServiceUrl } from '../manager/service';
import { isDevelopment } from '../utils/environment';

let socket: Socket;

class SocketEventError extends Error {
  name = 'SocketEventError';
}

type SocketEventRespones<T = unknown> =
  | {
      result: true;
      data: T;
    }
  | {
      result: false;
      message: string;
    };

/**
 * 封装后的 Socket
 */
export class AppSocket {
  listener: [string, (data: unknown) => void][] = [];

  constructor(private socket: Socket) {
    socket.onAny((eventName: string, data: unknown) => {
      const matched = this.listener.filter(([ev]) => ev === eventName); // 匹配到的监听器列表
      if (matched.length === 0) {
        // 没有匹配到任何处理函数
        console.warn(`[Socket IO] Unhandler event: ${eventName}`, data);
        return;
      }

      matched.forEach(([, cb]) => {
        cb(data);
      });
    });
  }

  get connected(): boolean {
    return socket.connected;
  }

  async request<T = unknown>(
    eventName: string,
    eventData: unknown = {}
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.socket.emit(eventName, eventData, (resp: SocketEventRespones<T>) => {
        if (resp.result === true) {
          resolve(resp.data);
        } else if (resp.result === false) {
          reject(new SocketEventError(resp.message));
        }
      });
    });
  }

  /**
   * 监听远程通知
   */
  listen<T>(eventName: string, callback: (data: T) => void) {
    this.listener.push([`notify:${eventName}`, callback as any]);
  }
}

/**
 * 创建Socket连接
 * 如果已经有Socket连接则关闭上一个
 * @param token Token
 */
export function createSocket(token: string): Promise<AppSocket> {
  if (!_isNil(socket)) {
    socket.close();
  }

  return new Promise((resolve, reject) => {
    socket = io(getServiceUrl(), {
      transports: ['websocket'],
      auth: {
        token,
      },
      forceNew: true,
    });
    socket.once('connect', () => {
      // 连接成功
      const appSocket = new AppSocket(socket);
      appSocket.request('chat.converse.findAndJoinRoom'); // 立即请求加入房间
      resolve(appSocket);
    });
    socket.once('error', () => {
      reject();
    });

    if (isDevelopment) {
      socket.onAny((...args) => {
        console.log('Receive Notify:', args);
      });
    }
  });
}
