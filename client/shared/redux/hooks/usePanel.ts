import { useAppSelector ,useAppDispatch} from './useAppSelector';
import {dragActions} from '../slices/drag'
import { useMemoizedFn } from '../..';

/**
 * 返回面板拖拽状态
 */
export function useDragstatus():boolean {
  return useAppSelector((state) => state.drag.isDraging ?? []);
}

export function updateDragStatus(){
  const dispatch = useAppDispatch();
  const setStatus = useMemoizedFn(
    (status:boolean) => {
      dispatch(dragActions.setDragStatus(status))}
  );
  
  /**
   * 更新
   */
  const updateStatus= useMemoizedFn((status: boolean) => {
    setStatus(status);
  });
  return  updateStatus ;
}

