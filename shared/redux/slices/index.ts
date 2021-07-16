import { combineReducers } from '@reduxjs/toolkit';
import { userReducer } from './user';
import { chatReducer } from './chat';

export const appReducer = combineReducers({
  user: userReducer,
  chat: chatReducer,
});

export type AppState = ReturnType<typeof appReducer>;

export { userActions } from './user';
export { chatActions } from './chat';
