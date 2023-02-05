import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { GlobalConfig } from '../../model/config';

export const defaultGlobalConfig: GlobalConfig = {
  uploadFileLimit: 1 * 1024 * 1024,
  emailVerification: false,
};

export interface GlobalState {
  /**
   * 网络状态
   */
  networkStatus: 'initial' | 'connected' | 'reconnecting' | 'disconnected';
  reconnectNum: number;
  config: GlobalConfig;
}

const initialState: GlobalState = {
  networkStatus: 'initial',
  reconnectNum: 0,
  config: defaultGlobalConfig,
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
    setGlobalConfig(state, action: PayloadAction<GlobalConfig>) {
      state.config = action.payload;
    },
  },
});

export const globalActions = globalSlice.actions;
export const globalReducer = globalSlice.reducer;
