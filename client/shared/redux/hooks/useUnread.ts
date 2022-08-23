import { useAppSelector } from './useAppSelector';

/**
 * 返回某些会话是否有未读信息
 */
export function useUnread(converseIds: string[]) {
  const ack = useAppSelector((state) => state.chat.ack);
  const lastMessageMap = useAppSelector((state) => state.chat.lastMessageMap);

  return converseIds.map((converseId) => {
    if (
      ack[converseId] === undefined &&
      lastMessageMap[converseId] !== undefined
    ) {
      // 没有已读记录且远程有数据
      return true;
    }

    // 当远端最后一条消息的id > 本地已读状态的最后一条消息id,
    // 则返回true(有未读消息)
    return lastMessageMap[converseId] > ack[converseId];
  });
}
