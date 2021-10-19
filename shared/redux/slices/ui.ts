import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
  panelWinUrls: string[];
}

const initialState: UIState = {
  panelWinUrls: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addPanelWindowUrl(state, action: PayloadAction<{ url: string }>) {
      const panelUrl = action.payload.url;
      state.panelWinUrls.push(panelUrl);
    },
    deletePanelWindowUrl(state, action: PayloadAction<{ url: string }>) {
      const panelUrl = action.payload.url;
      const index = state.panelWinUrls.indexOf(panelUrl);
      state.panelWinUrls.splice(index, 1);
    },
  },
});

export const uiActions = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
