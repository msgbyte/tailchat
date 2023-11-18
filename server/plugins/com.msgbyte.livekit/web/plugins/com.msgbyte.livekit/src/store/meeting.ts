import { createStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface MeetingState {
  rightPanel: 'chat' | 'member' | null;
  setRightPanel: (panel: 'chat' | 'member' | null) => void;
}

export function createMeetingStateStore() {
  return createStore<MeetingState>()(
    immer((set, get) => ({
      rightPanel: null,
      setRightPanel: (rightPanel) => {
        if (get().rightPanel === rightPanel) {
          // toggle
          set({ rightPanel: null });
        } else {
          set({ rightPanel });
        }
      },
    }))
  );
}

export type MeetingStateStoreType = ReturnType<typeof createMeetingStateStore>;
