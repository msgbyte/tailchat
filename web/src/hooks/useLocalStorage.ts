import { createUseStorageState } from 'tailchat-shared';

export const useLocalStorageState = createUseStorageState(() => localStorage);
