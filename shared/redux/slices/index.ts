import { combineReducers } from '@reduxjs/toolkit';
import { userReducer } from './user';
import { chatReducer } from './chat';
import { groupReducer } from './group';
import { uiReducer } from './ui';

export const appReducer = combineReducers({
  user: userReducer,
  chat: chatReducer,
  group: groupReducer,
  ui: uiReducer,
});

export type AppState = ReturnType<typeof appReducer>;

export { userActions } from './user';
export { chatActions } from './chat';
export { groupActions } from './group';
export { uiActions } from './ui';
