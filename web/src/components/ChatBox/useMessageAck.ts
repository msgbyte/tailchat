import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ChatMessage,
  isValidStr,
  updateAck,
  useAppDispatch,
  useUpdateRef,
} from 'tailchat-shared';
import { chatActions } from 'tailchat-shared/redux/slices';
import _debounce from 'lodash/debounce';

export function useMessageAck(converseId: string, messages: ChatMessage[]) {
  const messagesRef = useUpdateRef(messages);
  const dispatch = useAppDispatch();
  const lastMessageIdRef = useRef('');

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
        { leading: false, trailing: true }
      ),
    []
  );

  useEffect(() => {
    // 设置当前
    if (messagesRef.current.length === 0) {
      return;
    }

    const lastMessageId =
      messagesRef.current[messagesRef.current.length - 1]._id;
    setConverseAck(converseId, lastMessageId);
  }, [converseId]);

  /**
   * 更新会话最新消息
   */
  const updateConverseAck = useCallback(
    (lastMessageId: string) => {
      setConverseAck(converseId, lastMessageId);
    },
    [converseId]
  );

  return { updateConverseAck };
}
