import { combineReducers } from '@reduxjs/toolkit';
import { userReducer } from './user';

export const appReducer = combineReducers({
  user: userReducer,
});

export type AppState = ReturnType<typeof appReducer>;

export { userActions } from './user';
