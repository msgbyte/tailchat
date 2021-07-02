import { io, Socket } from 'socket.io-client';
import { config } from '../config';
import _isNil from 'lodash/isNil';

let socket: Socket;

/**
 * 创建Socket连接
 * 如果已经有Socket连接则关闭上一个
 * @param token Token
 */
export function createSocket(token: string) {
  if (!_isNil(socket)) {
    socket.close();
  }

  return new Promise<void>((resolve, reject) => {
    socket = io(config.serverUrl, {
      transports: ['websocket'],
      auth: {
        token,
      },
    });
    socket.once('connect', () => {
      // 连接成功
      resolve();
    });
    socket.once('error', () => {
      reject();
    });
  });
}
