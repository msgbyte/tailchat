import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GlobalConfig } from '../model/config';
import { defaultGlobalConfig } from '../utils/consts';

type GlobalConfigState = GlobalConfig;

export const useGlobalConfigStore = create<GlobalConfigState>()(
  persist(
    (set) => ({
      ...defaultGlobalConfig,
    }),
    {
      name: 'globalConfigStore',
    }
  )
);
