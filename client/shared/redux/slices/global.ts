import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GlobalState {
  /**
   * 网络状态
   */
  networkStatus: 'initial' | 'connected' | 'reconnecting' | 'disconnected';
  reconnectNum: number;
}

const initialState: GlobalState = {
  networkStatus: 'initial',
  reconnectNum: 0,
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
    incReconnectNum(state) {
      state.reconnectNum += 1;
    },
  },
});

export const globalActions = globalSlice.actions;
export const globalReducer = globalSlice.reducer;
