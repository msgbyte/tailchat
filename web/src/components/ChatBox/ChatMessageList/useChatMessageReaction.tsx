import { EmojiPanel } from '@/components/EmojiPanel';
import React, { useCallback } from 'react';
import type { ChatMessage } from 'tailchat-shared';

/**
 * 消息的反应信息操作
 */
export function useChatMessageReaction(
  payload: ChatMessage
): React.ReactElement {
  const handleSelect = useCallback((code: string) => {
    console.log('code', code);
  }, []);

  return <EmojiPanel onSelect={handleSelect} />;
}
