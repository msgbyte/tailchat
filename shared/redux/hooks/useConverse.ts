import { useMemo } from 'react';
import type { ChatConverseState } from '../slices/chat';
import { useAppSelector } from './useAppSelector';

/**
 * 获取私信会话列表
 * 并补充一些信息
 */
export function useDMConverseList(): ChatConverseState[] {
  const converses = useAppSelector((state) => state.chat.converses);

  return useMemo(
    () =>
      Object.entries(converses)
        .filter(([, info]) => info.type === 'DM')
        .map(([, info]) => info),
    [converses]
  );
}
