import { useLivekitState } from '../store/useLivekitState';

export function useIconIsShow() {
  return useLivekitState().isActive;
}

export function usePersionPanelIsShow() {
  return useLivekitState().isActive;
}
