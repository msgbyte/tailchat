import { useRef } from 'react';
import { useAppDispatch, useAppSelector } from './useAppSelector';
import _debounce from 'lodash/debounce';
import { isValidStr } from '../../utils/string-helper';
import { chatActions } from '../slices';
import { updateAck } from '../../model/converse';
import { useMemoizedFn } from '../../hooks/useMemoizedFn';

const updateAckDebounce = _debounce(
  (converseId: string, lastMessageId: string) => {
    updateAck(converseId, lastMessageId);
  },
  1000,
  { leading: true, trailing: true }
);

/**
 * 会话已读信息管理
 */
export function useConverseAck(converseId: string) {
  const dispatch = useAppDispatch();
  const converseLastMessage = useAppSelector(
    (state) => state.chat.lastMessageMap[converseId]
  );

  const lastMessageIdRef = useRef('');
  lastMessageIdRef.current = useAppSelector(
    (state) => state.chat.ack[converseId] ?? ''
  );

  const setConverseAck = useMemoizedFn(
    (converseId: string, lastMessageId: string) => {
      if (
        isValidStr(lastMessageIdRef.current) &&
        lastMessageId <= lastMessageIdRef.current
      ) {
        // 更新的数字比较小，跳过
        return;
      }

      dispatch(chatActions.setConverseAck({ converseId, lastMessageId }));
      updateAckDebounce(converseId, lastMessageId);
      lastMessageIdRef.current = lastMessageId;
    }
  );

  /**
   * 更新会话最新消息
   */
  const updateConverseAck = useMemoizedFn((lastMessageId: string) => {
    setConverseAck(converseId, lastMessageId);
  });

  const markConverseAllAck = useMemoizedFn(() => {
    updateConverseAck(converseLastMessage);
  });

  return { updateConverseAck, markConverseAllAck };
}
