import { combineReducers } from '@reduxjs/toolkit';
import { userReducer } from './user';
import { chatReducer } from './chat';
import { groupReducer } from './group';
import { uiReducer } from './ui';
import { globalReducer } from './global';

export const appReducer = combineReducers({
  global: globalReducer,
  user: userReducer,
  chat: chatReducer,
  group: groupReducer,
  ui: uiReducer,
});

export type AppState = ReturnType<typeof appReducer>;

export { globalActions } from './global';
export { userActions } from './user';
export { chatActions } from './chat';
export { groupActions } from './group';
export { uiActions } from './ui';
