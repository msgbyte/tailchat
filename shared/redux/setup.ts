import type { AppStore } from './store';
import type { AppSocket } from '../api/socket';
import { userActions } from './slices';
import type { UserBaseInfo } from '../model/user';
import type { FriendRequest } from '../model/friend';
import { getCachedUserInfo } from '../cache/cache';

/**
 * 初始化Redux 上下文
 */
export function setupRedux(socket: AppSocket, store: AppStore) {
  // 获取好友列表
  socket.request<UserBaseInfo[]>('friend.getAllFriends').then((data) => {
    store.dispatch(userActions.setFriendList(data));
  });

  // 获取好友邀请列表
  socket.request<FriendRequest[]>('friend.request.allRelated').then((data) => {
    store.dispatch(userActions.setFriendRequests(data));
  });

  socket.listen<{ userId: string }>('friend.add', ({ userId }) => {
    if (typeof userId !== 'string') {
      console.error('错误的信息', userId);
      return;
    }
    getCachedUserInfo(userId).then((info) => {
      store.dispatch(userActions.appendFriend(info));
    });
  });
}
