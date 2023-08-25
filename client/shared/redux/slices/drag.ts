import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DragState {
  /**
   * 拖拽
   */
  isDraging:boolean
 
}

const initialState: DragState = {
  isDraging: false,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setDragStatus(
      state,
      action: PayloadAction<DragState['isDraging']>
    ) {
      state.isDraging = action.payload;
    },
  },
});

export const dragActions = globalSlice.actions;
export const dragReducer = globalSlice.reducer;
