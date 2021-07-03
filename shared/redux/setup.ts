import type { AppStore } from './store';
import type { AppSocket } from '../api/socket';

/**
 * 初始化Redux 上下文
 */
export function setupRedux(socket: AppSocket, store: AppStore) {
  socket.request('friend.getAllFriends').then((resp) => {
    // TODO
    console.log('好友列表', resp);
  });
}
