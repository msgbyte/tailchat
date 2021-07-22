import { combineReducers } from '@reduxjs/toolkit';
import { userReducer } from './user';
import { chatReducer } from './chat';
import { groupReducer } from './group';

export const appReducer = combineReducers({
  user: userReducer,
  chat: chatReducer,
  group: groupReducer,
});

export type AppState = ReturnType<typeof appReducer>;

export { userActions } from './user';
export { chatActions } from './chat';
export { groupActions } from './group';
