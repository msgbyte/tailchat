import { io, Socket } from 'socket.io-client';
import _isNil from 'lodash/isNil';
import { getServiceUrl } from '../manager/service';
import { isDevelopment } from '../utils/environment';
import { showErrorToasts, showGlobalLoading, showToasts } from '../manager/ui';
import { t } from '../i18n';

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

  close() {
    this.socket.close();
  }

  /**
   * 初始Socket状态管理提示
   */
  closeFn: unknown = null; // 全局loading关闭函数
  setupSocketStatusTip() {
    const socket = this.socket;

    const showConnecting = () => {
      if (this.closeFn) {
        return;
      }
      this.closeFn = showGlobalLoading(t('正在重新链接'));
    };

    const closeConnecting = () => {
      if (this.closeFn && typeof this.closeFn === 'function') {
        this.closeFn();
      }
    };

    // 网络状态管理
    socket.on('connect', () => {
      console.log('连接成功');
      closeConnecting();
    });
    socket.on('connecting', (data) => {
      console.log('正在连接');

      showConnecting();
    });
    socket.on('reconnect', (data) => {
      console.log('重连成功');

      closeConnecting();
    });
    socket.on('reconnecting', (data) => {
      console.log('重连中...');
      showConnecting();
    });
    socket.on('disconnect', (data) => {
      console.log('与服务器的链接已断开');
      showErrorToasts(t('与服务器的链接已断开'));
      closeConnecting();
    });
    socket.on('connect_failed', (data) => {
      console.log('连接失败');
      showErrorToasts(t('连接失败'));
      closeConnecting();
    });
    socket.on('error', (data) => {
      console.log('网络出现异常', data);
      showErrorToasts(t('网络出现异常'));
      closeConnecting();
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
      appSocket.setupSocketStatusTip();
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
