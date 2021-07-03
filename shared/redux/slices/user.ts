import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserBaseInfo, UserLoginInfo } from '../../model/user';

interface UserState {
  info: UserLoginInfo | null;
  friends: UserBaseInfo[];
}

const initialState: UserState = { info: null, friends: [] };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo(state, action: PayloadAction<UserLoginInfo>) {
      state.info = action.payload;
    },
  },
});

export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;
