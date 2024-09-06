import { useAppSelector } from './useAppSelector';
import { useAckInfoChecker } from './useAckInfo';
import { useEffect } from 'react';

/**
 * 返回某些会话是否有未读信息
 */
export function useUnread(converseIds: string[]) {
  const ack = useAppSelector((state) => state.chat.ack);
  const lastMessageMap = useAppSelector((state) => state.chat.lastMessageMap);
  const { ensureAckInfo } = useAckInfoChecker();

  useEffect(() => {
    converseIds.forEach((converseId) => ensureAckInfo(converseId));
  }, [converseIds]);

  const unreadList = converseIds.map((converseId) => {
    if (
      ack[converseId] === undefined &&
      lastMessageMap[converseId] !== undefined
    ) {
      // 远程没有已读记录且获取到了最后一条消息
      return true;
    }

    // 当远端最后一条消息的id > 本地已读状态的最后一条消息id,
    // 则返回true(有未读消息)
    return lastMessageMap[converseId] > ack[converseId];
  });

  return unreadList;
}
