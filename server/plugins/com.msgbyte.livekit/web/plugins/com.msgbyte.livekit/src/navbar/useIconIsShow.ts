import { useLivekitState } from '../store/useLivekitState';

export function useIconIsShow() {
  return useLivekitState().isActive;
}
