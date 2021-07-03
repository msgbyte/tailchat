import { io, Socket } from 'socket.io-client';
import { config } from '../config';
import _isNil from 'lodash/isNil';

let socket: Socket;

class SocketEventError extends Error {
  name: 'SocketEventError';
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
  constructor(private socket: Socket) {}

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
    socket = io(config.serverUrl, {
      transports: ['websocket'],
      auth: {
        token,
      },
    });
    socket.once('connect', () => {
      // 连接成功
      resolve(new AppSocket(socket));
    });
    socket.once('error', () => {
      reject();
    });
  });
}
