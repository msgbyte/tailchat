import type { Room } from 'livekit-client';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface LivekitState {
  isActive: boolean;
  currentMeetingId: string;
  url: string;
  autoInviteIds: string[]; // 自动邀请用户，仅用于LivekitMeetingPanel(不用于LivekitGroupPanel)
  activeRoom: Room | null;
  setActive: (url: string) => void;
  setDeactive: () => Promise<void>;
}

export const useLivekitState = create<LivekitState>()(
  immer((set, get) => ({
    isActive: false,
    currentMeetingId: '',
    url: '',
    autoInviteIds: Array.isArray((window as any).autoInviteIds)
      ? (window as any).autoInviteIds
      : [],
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
