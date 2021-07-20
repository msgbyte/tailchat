import type { AppStore } from './store';
import type { AppSocket } from '../api/socket';
import { chatActions, userActions } from './slices';
import type { FriendRequest } from '../model/friend';
import type { UserDMList } from '../model/user';
import { fetchConverseInfo } from '../model/converse';
import { getCachedConverseInfo } from '../cache/cache';

/**
 * 初始化Redux 上下文
 */
export function setupRedux(socket: AppSocket, store: AppStore) {
  console.log('初始化Redux上下文...');

  // 获取好友列表
  socket.request<string[]>('friend.getAllFriends').then((data) => {
    store.dispatch(userActions.setFriendList(data));
  });

  // 获取好友邀请列表
  socket.request<FriendRequest[]>('friend.request.allRelated').then((data) => {
    store.dispatch(userActions.setFriendRequests(data));
  });

  socket.request<UserDMList>('user.dmlist.getAllConverse').then((data) => {
    data.converseIds.forEach(async (converseId) => {
      // TODO: 待优化, 可以在后端一次性返回

      const converse = await getCachedConverseInfo(converseId);
      store.dispatch(chatActions.setConverseInfo(converse));
    });
  });

  // ------------------ 通知

  socket.listen<{ userId: string }>('friend.add', ({ userId }) => {
    if (typeof userId !== 'string') {
      console.error('错误的信息', userId);
      return;
    }
    store.dispatch(userActions.appendFriend(userId));
  });

  socket.listen<FriendRequest>('friend.request.add', (request) => {
    store.dispatch(userActions.appendFriendRequest(request));
  });

  socket.listen<{ requestId: string }>(
    'friend.request.remove',
    ({ requestId }) => {
      store.dispatch(userActions.removeFriendRequest(requestId));
    }
  );
}
