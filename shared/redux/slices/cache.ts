import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserBaseInfo } from '../../model/user';
import _set from 'lodash/set';

interface CacheState {
  user: Record<string, UserBaseInfo>;
}

export type CacheKey = keyof CacheState;

const initialState: CacheState = { user: {} };

const cacheSlice = createSlice({
  name: 'cache',
  initialState,
  reducers: {
    setCache(
      state,
      action: PayloadAction<{
        scope: CacheKey;
        id: string;
        data: unknown;
      }>
    ) {
      const { scope, id, data } = action.payload;
      _set(state, [scope, id], data);
    },
  },
});

export const cacheActions = cacheSlice.actions;
export const cacheReducer = cacheSlice.reducer;
