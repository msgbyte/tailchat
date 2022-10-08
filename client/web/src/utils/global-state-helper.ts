import { useEffect } from 'react';
import { AppStore, AppState, AppSocket, useMemoizedFn } from 'tailchat-shared';

let _store: AppStore;
export function setGlobalStore(store: AppStore) {
  _store = store;
}

export function getGlobalState(): AppState | null {
  if (!_store) {
    return null;
  }
  return _store.getState();
}

let _socket: AppSocket;
export function setGlobalSocket(socket: AppSocket) {
  _socket = socket;
}
export function getGlobalSocket(): AppSocket | null {
  if (!_socket) {
    return null;
  }
  return _socket;
}

/**
 * 获取全局socket并监听
 */
export function useGlobalSocketEvent<T>(
  eventName: string,
  callback: (data: T) => void
) {
  const fn = useMemoizedFn(callback);

  useEffect(() => {
    if (_socket) {
      _socket.listen(eventName, fn);
    }

    return () => {
      if (_socket) {
        _socket.removeListener(eventName, fn);
      }
    };
  }, []);
}
