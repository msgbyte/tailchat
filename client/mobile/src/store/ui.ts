import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { zustandRNStorage } from '../lib/utils/storage';

interface UIStoreState {
  colorScheme: 'dark' | 'light' | 'auto';
  setColorScheme: (colorScheme: 'dark' | 'light' | 'auto' | string) => void;
}

export const useUIStore = create<UIStoreState>()(
  persist(
    immer((set) => ({
      colorScheme: 'dark',
      setColorScheme: (colorScheme) => {
        if (colorScheme === 'dark') {
          set({
            colorScheme: 'dark',
          });
        } else if (colorScheme === 'light') {
          set({
            colorScheme: 'light',
          });
        } else {
          set({
            colorScheme: 'auto',
          });
        }
      },
    })),
    {
      name: 'ui',
      storage: zustandRNStorage,
      partialize: (state) => ({ colorScheme: state.colorScheme }),
    }
  )
);
