import { useEffect } from 'react';
import { ChatMessage, sharedEvent, useConverseAck } from 'tailchat-shared';

/**
 * 消息已读的回调
 */
export function useMessageAck(converseId: string) {
  const { updateConverseAck } = useConverseAck(converseId);

  useEffect(() => {
    const handldReadMessage = (message: ChatMessage | null) => {
      const messageId = message?._id;
      if (messageId && converseId === message.converseId) {
        updateConverseAck(messageId);
      }
    };

    sharedEvent.on('readMessage', handldReadMessage);

    return () => {
      sharedEvent.off('readMessage', handldReadMessage);
    };
  }, [converseId]);
}
