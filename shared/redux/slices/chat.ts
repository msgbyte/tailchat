import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ChatConverseInfo } from '../../model/converse';
import type { ChatMessage } from '../../model/message';
import _uniqBy from 'lodash/uniqBy';
import _orderBy from 'lodash/orderBy';

export interface ChatConverseState extends ChatConverseInfo {
  messages: ChatMessage[];
}

interface ChatState {
  converses: Record<string, ChatConverseState>;
}

const initialState: ChatState = {
  converses: {},
};

const userSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    /**
     * 设置会话信息
     */
    setConverseInfo(state, action: PayloadAction<ChatConverseInfo>) {
      const converseId = action.payload._id;

      state.converses[converseId] = {
        messages: [],
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
        'createdAt',
        'asc'
      );

      state.converses[converseId].messages = newMessages;
    },
  },
});

export const chatActions = userSlice.actions;
export const chatReducer = userSlice.reducer;
