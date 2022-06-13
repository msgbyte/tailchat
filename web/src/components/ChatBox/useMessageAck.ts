import { useEffect } from 'react';
import { ChatMessage, useConverseAck, useUpdateRef } from 'tailchat-shared';
import _debounce from 'lodash/debounce';
import _last from 'lodash/last';

export function useMessageAck(converseId: string, messages: ChatMessage[]) {
  const { updateConverseAck } = useConverseAck(converseId);
  const messagesRef = useUpdateRef(messages);
  const updateConverseAckRef = useUpdateRef(updateConverseAck);

  useEffect(() => {
    // 设置当前
    if (messagesRef.current.length === 0) {
      return;
    }

    const lastMessageId = _last(messagesRef.current)!._id;
    updateConverseAckRef.current(lastMessageId);
  }, [converseId]);

  return { updateConverseAck };
}
