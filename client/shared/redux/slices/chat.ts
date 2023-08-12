import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ChatConverseInfo } from '../../model/converse';
import type {
  ChatMessage,
  ChatMessageReaction,
  LocalChatMessage,
  SendMessagePayload,
} from '../../model/message';
import _uniqBy from 'lodash/uniqBy';
import _orderBy from 'lodash/orderBy';
import _last from 'lodash/last';
import { isLocalMessageId, isValidStr } from '../../utils/string-helper';
import type { InboxItem } from '../../model/inbox';

export interface ChatConverseState extends ChatConverseInfo {
  messages: LocalChatMessage[];
  hasFetchedHistory: boolean;
  /**
   * 判定是否还有更多的信息
   */
  hasMoreMessage: boolean;
}

export interface ChatState {
  currentConverseId: string | null; // 当前活跃的会话id
  converses: Record<string, ChatConverseState>; // <会话Id, 会话信息>
  ack: Record<string, string>; // <会话Id, 本地最后一条会话Id>
  inbox: InboxItem[];

  /**
   * 会话最新消息mapping
   * <会话Id, 远程会话列表最后一条会话Id>
   */
  lastMessageMap: Record<string, string>;
}

const initialState: ChatState = {
  currentConverseId: null,
  converses: {},
  ack: {},
  inbox: [],
  lastMessageMap: {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    updateCurrentConverseId(state, action: PayloadAction<string | null>) {
      state.currentConverseId = action.payload;
    },

    /**
     * 设置会话信息
     */
    setConverseInfo(state, action: PayloadAction<ChatConverseInfo>) {
      const converseId = action.payload._id;

      const originInfo = state.converses[converseId]
        ? { ...state.converses[converseId] }
        : { messages: [], hasFetchedHistory: false, hasMoreMessage: true };

      state.converses[converseId] = {
        ...originInfo,
        ...action.payload,
      };
    },

    /**
     * 追加消息
     * 会根据id进行一次排序以确保顺序
     */
    appendConverseMessage(
      state,
      action: PayloadAction<{
        converseId: string;
        messages: ChatMessage[];
      }>
    ) {
      const { converseId, messages } = action.payload;

      if (!state.converses[converseId]) {
        // 没有会话信息, 请先设置会话信息
        console.error('没有会话信息, 请先设置会话信息');
        return;
      }

      // NOTICE: 按照该规则能确保本地消息一直在最后，因为l大于任何ObjectId
      const newMessages = _orderBy(
        _uniqBy([...state.converses[converseId].messages, ...messages], '_id'),
        '_id',
        'asc'
      );

      state.converses[converseId].messages = newMessages;

      /**
       * 如果在当前会话中，则暂时不更新最后收到的消息的本地状态，避免可能出现的瞬间更新最后消息(出现小红点) 但是会立即已读（小红点消失）
       * 所以仅对非当前会话的消息进行更新最后消息
       */
      if (state.currentConverseId !== converseId) {
        const lastMessageId = _last(
          newMessages.filter((m) => !isLocalMessageId(m._id))
        )?._id;
        if (isValidStr(lastMessageId)) {
          state.lastMessageMap[converseId] = lastMessageId;
        }
      }
    },

    /**
     * 追加本地消息消息
     */
    appendLocalMessage(
      state,
      action: PayloadAction<{
        author?: string;
        localMessageId: string;
        payload: SendMessagePayload;
      }>
    ) {
      const { author, localMessageId, payload } = action.payload;
      const { converseId, groupId, content, meta } = payload;

      if (!state.converses[converseId]) {
        // 没有会话信息, 请先设置会话信息
        console.error('没有会话信息, 请先设置会话信息');
        return;
      }

      const message: LocalChatMessage = {
        _id: localMessageId,
        author,
        groupId,
        converseId,
        content,
        meta: meta as Record<string, unknown>,
        isLocal: true,
      };

      const newMessages = _orderBy(
        _uniqBy([...state.converses[converseId].messages, message], '_id'),
        '_id',
        'asc'
      );

      state.converses[converseId].messages = newMessages;
    },

    /**
     * 初始化历史信息
     */
    initialHistoryMessage(
      state,
      action: PayloadAction<{
        converseId: string;
        historyMessages: ChatMessage[];
      }>
    ) {
      const { converseId, historyMessages } = action.payload;
      if (!state.converses[converseId]) {
        // 没有会话信息, 请先设置会话信息
        console.error('没有会话信息, 请先设置会话信息');
        return;
      }

      chatSlice.caseReducers.appendConverseMessage(
        state,
        chatSlice.actions.appendConverseMessage({
          converseId,
          messages: [...historyMessages],
        })
      );

      if (historyMessages.length < 50) {
        state.converses[converseId].hasMoreMessage = false;
      }

      state.converses[converseId].hasFetchedHistory = true;
    },

    /**
     * 追加历史信息
     */
    appendHistoryMessage(
      state,
      action: PayloadAction<{
        converseId: string;
        historyMessages: ChatMessage[];
      }>
    ) {
      const { converseId, historyMessages } = action.payload;
      if (!state.converses[converseId]) {
        // 没有会话信息, 请先设置会话信息
        console.error('没有会话信息, 请先设置会话信息');
        return;
      }

      chatSlice.caseReducers.appendConverseMessage(
        state,
        chatSlice.actions.appendConverseMessage({
          converseId,
          messages: [...historyMessages],
        })
      );

      if (historyMessages.length < 50) {
        state.converses[converseId].hasMoreMessage = false;
      }
      state.converses[converseId].hasFetchedHistory = true;
    },

    /**
     * 清理所有会话信息
     */
    clearAllConverses(state) {
      state.converses = {};
    },

    /**
     * 设置已读消息
     */
    setConverseAck(
      state,
      action: PayloadAction<{
        converseId: string;
        lastMessageId: string;
      }>
    ) {
      const { converseId, lastMessageId } = action.payload;
      state.ack[converseId] = lastMessageId;
    },

    /**
     * 更新消息信息
     */
    updateMessageInfo(
      state,
      action: PayloadAction<{
        messageId?: string;
        message: Partial<LocalChatMessage>;
      }>
    ) {
      const { message } = action.payload;
      const messageId = action.payload.messageId ?? message._id;
      const converseId = message.converseId;
      if (!converseId) {
        console.warn('Not found converse id,', message);
        return;
      }

      const converse = state.converses[converseId];
      if (!converse) {
        console.warn('Not found converse,', converseId);
        return;
      }

      const index = converse.messages.findIndex((m) => m._id === messageId);
      if (index >= 0) {
        converse.messages[index] = {
          ...converse.messages[index],
          ...message,
        };
      }
    },

    /**
     * 删除消息
     */
    deleteMessageById(
      state,
      action: PayloadAction<{
        converseId: string;
        messageId: string;
      }>
    ) {
      const { converseId, messageId } = action.payload;
      const converse = state.converses[converseId];
      if (!converse) {
        console.warn('Not found converse,', converseId);
        return;
      }

      const index = converse.messages.findIndex((m) => m._id === messageId);
      if (index >= 0) {
        converse.messages.splice(index, 1);
      }
    },

    /**
     * 设置远程的最后一条会话的id
     */
    setLastMessageMap(
      state,
      action: PayloadAction<
        {
          converseId: string;
          lastMessageId: string;
        }[]
      >
    ) {
      const list = action.payload;

      if (Array.isArray(list)) {
        list.forEach((item) => {
          state.lastMessageMap[item.converseId] = item.lastMessageId;
        });
      }
    },

    /**
     * 追加消息反应
     */
    appendMessageReaction(
      state,
      action: PayloadAction<{
        converseId: string;
        messageId: string;
        reaction: ChatMessageReaction;
      }>
    ) {
      const { converseId, messageId, reaction } = action.payload;
      const converse = state.converses[converseId];
      if (!converse) {
        console.warn('Not found converse,', converseId);
        return;
      }

      const message = converse.messages.find((m) => m._id === messageId);
      if (!message) {
        console.warn('Not found message,', messageId);
        return;
      }

      if (!Array.isArray(message.reactions)) {
        message.reactions = [];
      }

      message.reactions.push(reaction);
    },

    /**
     * 移除消息反应
     */
    removeMessageReaction(
      state,
      action: PayloadAction<{
        converseId: string;
        messageId: string;
        reaction: ChatMessageReaction;
      }>
    ) {
      const { converseId, messageId, reaction } = action.payload;
      const converse = state.converses[converseId];
      if (!converse) {
        console.warn('Not found converse,', converseId);
        return;
      }

      const message = converse.messages.find((m) => m._id === messageId);
      if (!message) {
        console.warn('Not found message,', messageId);
        return;
      }

      if (!Array.isArray(message.reactions)) {
        message.reactions = [];
      }

      const reactionIndex = message.reactions.findIndex(
        (r) => r.name === reaction.name && r.author === reaction.author
      );
      message.reactions.splice(reactionIndex, 1);
    },
    /**
     * 设置收件箱
     */
    setInboxList(state, action: PayloadAction<InboxItem[]>) {
      const list = action.payload;
      state.inbox = list;
    },

    /**
     * 增加收件箱项目
     */
    appendInboxItem(state, action: PayloadAction<InboxItem>) {
      state.inbox.push(action.payload);
    },
    /**
     * 设置收件箱
     */
    setInboxItemAck(state, action: PayloadAction<string>) {
      const inboxItemId = action.payload;
      const item = state.inbox.find((item) => item._id === inboxItemId);

      if (item) {
        item.readed = true;
      }
    },
  },
});

export const chatActions = chatSlice.actions;
export const chatReducer = chatSlice.reducer;
