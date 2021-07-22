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
  },
});

export const groupActions = groupSlice.actions;
export const groupReducer = groupSlice.reducer;
