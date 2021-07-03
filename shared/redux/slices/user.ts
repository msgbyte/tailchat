import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserLoginInfo } from '../../model/user';

interface UserState {
  info: UserLoginInfo | null;
}

const initialState: UserState = { info: null };

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
