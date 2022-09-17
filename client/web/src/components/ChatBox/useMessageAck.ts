import { useEffect } from 'react';
import {
  ChatMessage,
  useConverseAck,
  useMemoizedFn,
  useUpdateRef,
} from 'tailchat-shared';
import _last from 'lodash/last';

/**
 * 消息已读的回调
 */
export function useMessageAck(converseId: string, messages: ChatMessage[]) {
  const { updateConverseAck } = useConverseAck(converseId);
  const messagesRef = useUpdateRef(messages);
  const updateConverseAckMemo = useMemoizedFn(updateConverseAck);

  useEffect(() => {
    // 设置当前
    if (messagesRef.current.length === 0) {
      return;
    }

    const lastMessage = _last(messagesRef.current);
    if (lastMessage) {
      const lastMessageId = lastMessage?._id;
      updateConverseAckMemo(lastMessageId);
    }
  }, [converseId]);

  return { updateConverseAck };
}
