import { useCallback, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from './useAppSelector';
import _debounce from 'lodash/debounce';
import { isValidStr } from '../../utils/string-helper';
import { chatActions } from '../slices';
import { updateAck } from '../../model/converse';

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

  const setConverseAck = useMemo(
    () =>
      _debounce(
        (converseId: string, lastMessageId: string) => {
          if (
            isValidStr(lastMessageIdRef.current) &&
            lastMessageId <= lastMessageIdRef.current
          ) {
            // 更新的数字比较小，跳过
            return;
          }

          dispatch(chatActions.setConverseAck({ converseId, lastMessageId }));
          updateAck(converseId, lastMessageId);
          lastMessageIdRef.current = lastMessageId;
        },
        1000,
        { leading: true, trailing: true }
      ),
    []
  );

  /**
   * 更新会话最新消息
   */
  const updateConverseAck = useCallback(
    (lastMessageId: string) => {
      setConverseAck(converseId, lastMessageId);
    },
    [converseId]
  );

  const markConverseAllAck = useCallback(() => {
    updateConverseAck(converseLastMessage);
  }, [converseLastMessage]);

  return { updateConverseAck, markConverseAllAck };
}
