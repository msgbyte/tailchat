import type { AppStore, AppState } from 'tailchat-shared';

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
