import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ChatConverseInfo } from '../../model/converse';
import type { ChatMessage } from '../../model/message';
import _uniqBy from 'lodash/uniqBy';
import _orderBy from 'lodash/orderBy';
import _last from 'lodash/last';
import { isValidStr } from '../../utils/string-helper';

export interface ChatConverseState extends ChatConverseInfo {
  messages: ChatMessage[];
  hasFetchedHistory: boolean;
}

interface ChatState {
  currentConverseId: string | null; // 当前活跃的会话id
  converses: Record<string, ChatConverseState>; // <会话Id, 会话信息>
  ack: Record<string, string>; // <会话Id, 本地最后一条会话Id>
  lastMessageMap: Record<string, string>; // <会话Id, 远程最后一条会话Id>
}

const initialState: ChatState = {
  currentConverseId: null,
  converses: {},
  ack: {},
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

      state.converses[converseId] = {
        messages: [],
        hasFetchedHistory: false,
        ...action.payload,
      };
    },

    /**
     * 追加消息
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

      const newMessages = _orderBy(
        _uniqBy([...state.converses[converseId].messages, ...messages], '_id'),
        '_id',
        'asc'
      );

      state.converses[converseId].messages = newMessages;

      if (state.currentConverseId !== converseId) {
        const lastMessageId = _last(messages)?._id;
        if (isValidStr(lastMessageId)) {
          state.lastMessageMap[converseId] = lastMessageId;
        }
      }
    },

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

      state.converses[converseId].hasFetchedHistory = true;
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

      list.forEach((item) => {
        state.lastMessageMap[item.converseId] = item.lastMessageId;
      });
    },
  },
});

export const chatActions = chatSlice.actions;
export const chatReducer = chatSlice.reducer;
