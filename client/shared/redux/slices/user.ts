import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _set from 'lodash/set';
import type { UserLoginInfo } from '../../model/user';
import type { FriendRequest } from '../../model/friend';

export interface FriendInfo {
  id: string;
  nickname?: string;
}

export interface UserState {
  info: UserLoginInfo | null;
  friends: FriendInfo[]; // 好友的id列表
  friendRequests: FriendRequest[];
}

const initialState: UserState = {
  info: null,
  friends: [],
  friendRequests: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo(state, action: PayloadAction<UserLoginInfo>) {
      state.info = action.payload;
    },
    setUserInfoField(
      state,
      action: PayloadAction<{ fieldName: keyof UserLoginInfo; fieldValue: any }>
    ) {
      const { fieldName, fieldValue } = action.payload;
      if (state.info === null) {
        return;
      }

      _set(state.info, [fieldName], fieldValue);
    },
    setUserInfoExtra(
      state,
      action: PayloadAction<{ fieldName: string; fieldValue: any }>
    ) {
      const { fieldName, fieldValue } = action.payload;
      if (state.info === null) {
        return;
      }

      _set(state.info, ['extra', fieldName], fieldValue);
    },
    setFriendList(state, action: PayloadAction<FriendInfo[]>) {
      state.friends = action.payload;
    },
    setFriendRequests(state, action: PayloadAction<FriendRequest[]>) {
      state.friendRequests = action.payload;
    },
    appendFriend(state, action: PayloadAction<FriendInfo>) {
      if (state.friends.some((id) => id === action.payload)) {
        return;
      }

      state.friends.push(action.payload);
    },
    removeFriend(state, action: PayloadAction<string>) {
      const friendId = action.payload;
      const index = state.friends.findIndex((item) => item.id === friendId);
      if (index >= 0) {
        state.friends.splice(index, 1);
      }
    },
    appendFriendRequest(state, action: PayloadAction<FriendRequest>) {
      if (state.friendRequests.some(({ _id }) => _id === action.payload._id)) {
        return;
      }

      state.friendRequests.push(action.payload);
    },
    removeFriendRequest(state, action: PayloadAction<string>) {
      const index = state.friendRequests.findIndex(
        ({ _id }) => _id === action.payload
      );
      if (index >= 0) {
        state.friendRequests.splice(index, 1);
      }
    },
  },
});

export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;
