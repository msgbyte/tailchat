import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { GroupInfo } from '../../model/group';

interface GroupState {
  groups: Record<string, GroupInfo>;
}

const initialState: GroupState = {
  groups: {},
};

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    appendGroups(state, action: PayloadAction<GroupInfo[]>) {
      const groups = action.payload;

      for (const group of groups) {
        state.groups[group._id] = {
          ...state.groups[group._id],
          ...group,
        };
      }
    },
    updateGroup(state, action: PayloadAction<GroupInfo>) {
      const group = action.payload;
      const groupId = group._id;

      if (state.groups[groupId]) {
        // NOTICE: updateGroup 只会去更新，不会去添加新的
        state.groups[groupId] = {
          ...state.groups[groupId],
          ...group,
        };
      }
    },
    removeGroup(state, action: PayloadAction<string>) {
      const groupId = action.payload;
      delete state.groups[groupId];
    },
  },
});

export const groupActions = groupSlice.actions;
export const groupReducer = groupSlice.reducer;
