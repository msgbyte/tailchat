import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GlobalState {
  /**
   * 网络状态
   */
  networkStatus: 'initial' | 'connected' | 'reconnecting' | 'disconnected';
}

const initialState: GlobalState = {
  networkStatus: 'initial',
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setNetworkStatus(
      state,
      action: PayloadAction<GlobalState['networkStatus']>
    ) {
      state.networkStatus = action.payload;
    },
  },
});

export const globalActions = globalSlice.actions;
export const globalReducer = globalSlice.reducer;
