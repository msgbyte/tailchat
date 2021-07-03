import { AppSocket, AppStore, setupRedux } from 'pawchat-shared';
import { useEffect } from 'react';

/**
 * 初始化 全局上下文 只执行一次
 */
export function useSetupRedux(socket: AppSocket, store: AppStore) {
  useEffect(() => {
    if (socket !== undefined && store !== undefined) {
      setupRedux(socket, store);
    }
  }, [socket, store]);
}
