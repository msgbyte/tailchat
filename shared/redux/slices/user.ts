import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  FriendRequest,
  UserBaseInfo,
  UserLoginInfo,
} from '../../model/user';

interface UserState {
  info: UserLoginInfo | null;
  friends: UserBaseInfo[];
  friendRequests: FriendRequest[];
}

const initialState: UserState = { info: null, friends: [], friendRequests: [] };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo(state, action: PayloadAction<UserLoginInfo>) {
      state.info = action.payload;
    },
    setFriendList(state, action: PayloadAction<UserBaseInfo[]>) {
      state.friends = action.payload;
    },
    setFriendRequests(state, action: PayloadAction<FriendRequest[]>) {
      state.friendRequests = action.payload;
    },
  },
});

export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;
