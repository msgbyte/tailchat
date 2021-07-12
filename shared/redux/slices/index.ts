import { combineReducers } from '@reduxjs/toolkit';
import { cacheReducer } from './cache';
import { userReducer } from './user';

export const appReducer = combineReducers({
  cache: cacheReducer,
  user: userReducer,
});

export type AppState = ReturnType<typeof appReducer>;

export { cacheActions } from './cache';
export { userActions } from './user';
