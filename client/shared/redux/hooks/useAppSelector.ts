import type { AppState } from '../slices';
import { useSelector, useDispatch, useStore } from 'react-redux';

export function useAppSelector<T>(
  selector: (state: AppState) => T,
  equalityFn?: (left: T, right: T) => boolean
) {
  return useSelector<AppState, T>(selector, equalityFn);
}

export const useAppDispatch = useDispatch;

export function useAppStore<AppState>() {
  return useStore<AppState>();
}
