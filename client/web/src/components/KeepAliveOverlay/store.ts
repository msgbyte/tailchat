import type React from 'react';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface ElementDisplayRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface KeepAliveState {
  cachedComponents: Record<
    string,
    {
      visible: boolean;
      element: React.ReactElement;
      rect: ElementDisplayRect;
    }
  >;
  mount: (cacheId: string, element: React.ReactElement) => void;
  show: (cacheId: string) => void;
  hide: (cacheId: string) => void;
  updateRect: (cacheId: string, rect: ElementDisplayRect) => void;
}

export const useKeepAliveStore = create<KeepAliveState>()(
  immer((set) => ({
    cachedComponents: {},
    mount: (cacheId, element) => {
      set((state) => {
        const cachedComponents = state.cachedComponents;
        if (cachedComponents[cacheId]) {
          // 已经挂载过
          state.cachedComponents[cacheId].visible = true;
          return;
        }

        cachedComponents[cacheId] = {
          visible: true,
          element,
          rect: {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
          },
        };
      });
    },
    show: (cacheId) => {
      set((state) => {
        if (!state.cachedComponents[cacheId]) {
          return;
        }

        state.cachedComponents[cacheId].visible = true;
      });
    },
    hide: (cacheId) => {
      set((state) => {
        if (!state.cachedComponents[cacheId]) {
          return;
        }

        state.cachedComponents[cacheId].visible = false;
      });
    },
    updateRect: (cacheId: string, rect: ElementDisplayRect) => {
      set((state) => {
        if (!state.cachedComponents[cacheId]) {
          return;
        }

        state.cachedComponents[cacheId].rect = rect;
      });
    },
  }))
);
