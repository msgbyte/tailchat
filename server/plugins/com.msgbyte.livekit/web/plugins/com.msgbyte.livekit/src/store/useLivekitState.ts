import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface LivekitState {
  isActive: boolean;
  url: string;
  setActive: (url: string) => void;
  setDeactive: () => void;
}

export const useLivekitState = create<LivekitState>()(
  immer((set) => ({
    isActive: false,
    url: '',
    setActive(url) {
      set((state) => {
        state.isActive = true;
        state.url = url;
      });
    },
    setDeactive() {
      set((state) => {
        state.isActive = false;
        state.url = '';
      });
    },
  }))
);
