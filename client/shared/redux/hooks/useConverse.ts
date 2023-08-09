import { useMemo } from 'react';
import { ChatConverseType } from '../../model/converse';
import type { ChatConverseState } from '../slices/chat';
import { useAppSelector } from './useAppSelector';

/**
 * 获取私信会话列表
 * 并补充一些信息
 */
export function useDMConverseList(): ChatConverseState[] {
  const converses = useAppSelector((state) => state.chat.converses);
  const lastMessageMap = useAppSelector((state) => state.chat.lastMessageMap);

  const filteredConverse = useMemo(
    () =>
      Object.entries(converses)
        .filter(([, info]) =>
          [ChatConverseType.DM, ChatConverseType.Multi].includes(info.type)
        )
        .map(([, info]) => info),
    [converses]
  );

  return useMemo(() => {
    return filteredConverse.sort((a, b) => {
      return (lastMessageMap[a._id] ?? '') < (lastMessageMap[b._id] ?? '')
        ? 1
        : -1;
    });
  }, [filteredConverse, lastMessageMap]);
}
