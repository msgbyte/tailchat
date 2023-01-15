import type { AppStore } from './store';
import type { AppSocket } from '../api/socket';
import {
  chatActions,
  globalActions,
  groupActions,
  userActions,
} from './slices';
import type { FriendRequest } from '../model/friend';
import { getCachedConverseInfo } from '../cache/cache';
import type { GroupInfo } from '../model/group';
import {
  ChatMessage,
  ChatMessageReaction,
  fetchConverseLastMessages,
} from '../model/message';
import { socketEventListeners } from '../manager/socket';
import { showToasts } from '../manager/ui';
import { t } from '../i18n';
import {
  ChatConverseInfo,
  ChatConverseType,
  fetchUserAck,
} from '../model/converse';
import { appendUserDMConverse } from '../model/user';
import { sharedEvent } from '../event';
import type { InboxItem } from '../model/inbox';

/**
 * 初始化 Redux 上下文
 * 该文件用于处理远程数据与本地 Redux 状态的交互
 */
export function setupRedux(socket: AppSocket, store: AppStore) {
  store.dispatch(globalActions.setNetworkStatus('initial'));
  initial(socket, store);
  listenNotify(socket, store);

  // 断线重连重新初始化信息
  socket.onReconnect(() => {
    console.warn('因为断线重连触发重新同步远程数据');
    initial(socket, store);
    /**
     * 重置会话列表
     * 如果当前已经打开了一个会话列表则会让该会话自行更新(由useConverseMessage保障)
     */
    store.dispatch(chatActions.clearAllConverses());
    store.dispatch(globalActions.incReconnectNum());
  });

  sharedEvent.on('updateNetworkStatus', (status) => {
    store.dispatch(globalActions.setNetworkStatus(status));
  });
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

      try {
        const converse = await getCachedConverseInfo(converseId);
        store.dispatch(chatActions.setConverseInfo(converse));
      } catch (e) {
        console.error(e);
      }
    });
  });

  /**
   * 获取用户群组列表
   */
  socket.request<GroupInfo[]>('group.getUserGroups').then((groups) => {
    store.dispatch(groupActions.appendGroups(groups));
  });

  socket.request<InboxItem[]>('chat.inbox.all').then((list) => {
    store.dispatch(chatActions.setInboxList(list));
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
    // 处理接受到的消息
    const converseId = message.converseId;
    const converse = store.getState().chat.converses[converseId];

    // 添加消息到会话中
    const appendMessage = () => {
      store.dispatch(
        chatActions.appendConverseMessage({
          converseId,
          messages: [message],
        })
      );
    };

    if (converse) {
      // 如果该会话已经加载(群组面板)
      appendMessage();
    } else if (!message.groupId) {
      // 如果会话没有加载, 但是是私信消息
      // 则获取会话信息后添加到会话消息中
      getCachedConverseInfo(converseId).then((converse) => {
        if (converse.type === ChatConverseType.DM) {
          // 如果是私人会话, 则添加到dmlist
          appendUserDMConverse(converse._id);
        }

        store.dispatch(chatActions.setConverseInfo(converse));

        appendMessage();
      });
    } else {
      // 是群组未加载的消息面板的消息
      // 设置会话信息
      store.dispatch(
        chatActions.setLastMessageMap([
          {
            converseId,
            lastMessageId: message._id,
          },
        ])
      );
    }
  });

  socket.listen<ChatMessage>('chat.message.update', (message) => {
    store.dispatch(
      chatActions.updateMessageInfo({
        message,
      })
    );
  });

  socket.listen<{
    converseId: string;
    messageId: string;
  }>('chat.message.delete', ({ converseId, messageId }) => {
    store.dispatch(
      chatActions.deleteMessageById({
        converseId,
        messageId,
      })
    );
  });

  socket.listen<{
    converseId: string;
    messageId: string;
    reaction: ChatMessageReaction;
  }>('chat.message.addReaction', ({ converseId, messageId, reaction }) => {
    store.dispatch(
      chatActions.appendMessageReaction({
        converseId,
        messageId,
        reaction,
      })
    );
  });

  socket.listen<{
    converseId: string;
    messageId: string;
    reaction: ChatMessageReaction;
  }>('chat.message.removeReaction', ({ converseId, messageId, reaction }) => {
    store.dispatch(
      chatActions.removeMessageReaction({
        converseId,
        messageId,
        reaction,
      })
    );
  });

  socket.listen<ChatConverseInfo>(
    'chat.converse.updateDMConverse',
    (converse) => {
      store.dispatch(chatActions.setConverseInfo(converse));
    }
  );

  socket.listen<GroupInfo>('group.add', (groupInfo) => {
    store.dispatch(groupActions.appendGroups([groupInfo]));
  });

  socket.listen<GroupInfo>('group.updateInfo', (groupInfo) => {
    store.dispatch(groupActions.updateGroup(groupInfo));
  });

  socket.listen<{ groupId: string }>('group.remove', ({ groupId }) => {
    store.dispatch(groupActions.removeGroup(groupId));
  });

  socket.listen('chat.inbox.updated', () => {
    // 检测到收件箱列表被更新，需要重新获取
    socket.request<InboxItem[]>('chat.inbox.all').then((list) => {
      store.dispatch(chatActions.setInboxList(list));
    });
  });

  // 其他的额外的通知
  socketEventListeners.forEach(({ eventName, eventFn }) => {
    socket.listen(eventName, eventFn);
  });
}
