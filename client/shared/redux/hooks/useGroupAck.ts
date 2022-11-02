import { useMemoizedFn } from '../../hooks/useMemoizedFn';
import { updateAck } from '../../model/converse';
import { isConversePanel } from '../../utils/panel-helper';
import { chatActions } from '../slices';
import { useAppDispatch, useAppSelector } from './useAppSelector';
import { useGroupInfo } from './useGroup';

/**
 * 群组级别的已读管理
 */
export function useGroupAck(groupId: string) {
  const groupInfo = useGroupInfo(groupId);
  const lastMessageMap = useAppSelector((state) => state.chat.lastMessageMap);
  const dispatch = useAppDispatch();

  const markGroupAllAck = useMemoizedFn(() => {
    const conversePanels = (groupInfo?.panels ?? []).filter(isConversePanel);

    for (const converse of conversePanels) {
      const converseId = converse.id;
      const lastMessageId = lastMessageMap[converseId];

      if (converseId && lastMessageId) {
        dispatch(chatActions.setConverseAck({ converseId, lastMessageId }));
        updateAck(converseId, lastMessageId);
      }
    }
  });

  return { markGroupAllAck };
}
