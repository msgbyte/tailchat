import type { AppStore, AppState, AppSocket } from 'tailchat-shared';

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
