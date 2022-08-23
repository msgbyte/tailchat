import { createUseStorageState } from 'tailchat-shared';

export const useSessionStorageState = createUseStorageState(
  () => sessionStorage
);
