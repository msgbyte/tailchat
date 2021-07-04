import type { AppStore } from './store';
import type { AppSocket } from '../api/socket';
import { userActions } from './slices';
import type { FriendRequest, UserBaseInfo } from '../model/user';

/**
 * 初始化Redux 上下文
 */
export function setupRedux(socket: AppSocket, store: AppStore) {
  // 获取好友列表
  socket.request<UserBaseInfo[]>('friend.getAllFriends').then((data) => {
    store.dispatch(userActions.setFriendList(data));
  });

  // 获取好友邀请列表
  socket
    .request<FriendRequest[]>('friend.request.allRelatived')
    .then((data) => {
      store.dispatch(userActions.setFriendRequests(data));
    });
}
