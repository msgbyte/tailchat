import { io, Socket } from 'socket.io-client';
import msgpackParser from 'socket.io-msgpack-parser';
import _isNil from 'lodash/isNil';
import type { InboxItem } from '../../types';
import { showNotification } from '../notifications';

let _socket: Socket;
/**
 * 创建Socket连接
 * 如果已经有Socket连接则关闭上一个
 * @param token Token
 */
export function createSocket(url: string, token: string): Promise<Socket> {
  if (!_isNil(_socket)) {
    _socket.close();
  }

  return new Promise((resolve, reject) => {
    _socket = io(url, {
      transports: ['websocket'],
      auth: {
        token,
      },
      forceNew: true,
      parser: msgpackParser,
    });
    _socket.once('connect', () => {
      // 连接成功
      resolve(_socket);
    });
    _socket.once('error', () => {
      reject();
    });
  });
}

export function bindSocketEvent(socket: Socket): void {
  socket.on('notify:chat.inbox.append', (inboxItem: InboxItem) => {
    if (inboxItem.type === 'message') {
      const payload = inboxItem.message ?? inboxItem.payload;
      showNotification({
        title: payload.converseId ?? '',
        body: payload.messageSnippet ?? '',
      });
    }
  });
}
