import type { Room } from 'livekit-client';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface LivekitState {
  isActive: boolean;
  url: string;
  activeRoom: Room | null;
  setActive: (url: string) => void;
  setDeactive: () => Promise<void>;
}

export const useLivekitState = create<LivekitState>()(
  immer((set, get) => ({
    isActive: false,
    url: '',
    activeRoom: null,
    setActive(url) {
      set((state) => {
        state.isActive = true;
        state.url = url;
      });
    },
    async setDeactive() {
      const { activeRoom } = get();
      if (activeRoom) {
        await activeRoom.disconnect(true);
      }

      set((state) => {
        state.isActive = false;
        state.url = '';
        state.activeRoom = null;
      });
    },
  }))
);
