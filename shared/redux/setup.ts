import type { AppStore } from './store';
import type { AppSocket } from '../api/socket';
import { chatActions, groupActions, userActions } from './slices';
import type { FriendRequest } from '../model/friend';
import { getCachedConverseInfo } from '../cache/cache';
import type { GroupInfo } from '../model/group';
import { ChatMessage, fetchConverseLastMessages } from '../model/message';
import { socketEventListeners } from '../manager/socket';
import { showToasts } from '../manager/ui';
import { t } from '../i18n';
import { fetchUserAck } from '../model/converse';

/**
 * 初始化 Redux 上下文
 * 该文件用于处理远程数据与本地 Redux 状态的交互
 */
export function setupRedux(socket: AppSocket, store: AppStore) {
  initial(socket, store);
  listenNotify(socket, store);
}

/**
 * 初始化数据
 */
function initial(socket: AppSocket, store: AppStore) {
  console.log('初始化Redux上下文...');

  // 立即请求加入房间
  const conversesP = socket
    .request<{
      dmConverseIds: string[];
      groupIds: string[];
      panelIds: string[];
    }>('chat.converse.findAndJoinRoom')
    .catch((err) => {
      console.error(err);
      showToasts(
        t('无法加入房间, 您将无法获取到最新的信息, 请刷新页面后重试'),
        'error'
      );
      throw new Error('findAndJoinRoom failed');
    });

  Promise.all([conversesP, fetchUserAck()]).then(
    ([{ dmConverseIds, panelIds }, acks]) => {
      /**
       * TODO: 这里的逻辑还需要优化
       * 可能ack和lastMessageMap可以无关？
       */

      // 设置已读消息
      acks.forEach((ackInfo) => {
        store.dispatch(
          chatActions.setConverseAck({
            converseId: ackInfo.converseId,
            lastMessageId: ackInfo.lastMessageId,
          })
        );
      });

      const converseIds = [...dmConverseIds, ...panelIds];
      fetchConverseLastMessages(converseIds).then((list) => {
        store.dispatch(chatActions.setLastMessageMap(list));
      });
    }
  );

  // 获取好友列表
  socket.request<string[]>('friend.getAllFriends').then((data) => {
    store.dispatch(userActions.setFriendList(data));
  });

  // 获取好友邀请列表
  socket.request<FriendRequest[]>('friend.request.allRelated').then((data) => {
    store.dispatch(userActions.setFriendRequests(data));
  });

  // 获取所有的当前用户会话列表
  socket.request<string[]>('user.dmlist.getAllConverse').then((data) => {
    (data ?? []).forEach(async (converseId) => {
      // TODO: 待优化, 可以在后端一次性返回

      const converse = await getCachedConverseInfo(converseId);
      store.dispatch(chatActions.setConverseInfo(converse));
    });
  });

  /**
   * 获取用户群组列表
   */
  socket.request<GroupInfo[]>('group.getUserGroups').then((groups) => {
    store.dispatch(groupActions.appendGroups(groups));
  });
}

/**
 * 监听远程通知
 */
function listenNotify(socket: AppSocket, store: AppStore) {
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

  socket.listen<ChatMessage>('chat.message.add', (message) => {
    store.dispatch(
      chatActions.appendConverseMessage({
        converseId: message.converseId,
        messages: [message],
      })
    );
  });

  socket.listen<GroupInfo>('group.add', (groupInfo) => {
    store.dispatch(groupActions.appendGroups([groupInfo]));
  });

  socket.listen<GroupInfo>('group.updateInfo', (groupInfo) => {
    store.dispatch(groupActions.updateGroup(groupInfo));
  });

  socket.listen<{ groupId: string }>('group.remove', ({ groupId }) => {
    store.dispatch(groupActions.removeGroup(groupId));
  });

  // 其他的额外的通知
  socketEventListeners.forEach(({ eventName, eventFn }) => {
    socket.listen(eventName, eventFn);
  });
}
