import { getCachedConverseInfo } from '../../cache/cache';
import { useAsync } from '../../hooks/useAsync';
import { fetchConverseMessage } from '../../model/message';
import { chatActions } from '../slices';
import { useAppDispatch, useAppSelector } from './useAppSelector';

/**
 * 会话消息管理
 */
export function useConverseMessage(converseId: string) {
  const converse = useAppSelector((state) => state.chat.converses[converseId]);
  const dispatch = useAppDispatch();
  const messages = converse?.messages ?? [];

  const { loading, error } = useAsync(async () => {
    if (!converse) {
      const converse = await getCachedConverseInfo(converseId);
      dispatch(chatActions.setConverseInfo(converse));

      const messages = await fetchConverseMessage(converseId);
      dispatch(
        chatActions.appendConverseMessage({
          converseId,
          messages,
        })
      );
    }
  }, [converse, converseId]);

  return { messages, loading, error };
}
