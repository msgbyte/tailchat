import React from 'react';
import { useChatInputActionContext } from './context';
import { EmojiPanel } from '@/components/Emoji';
import { BaseChatInputButton } from './BaseChatInputButton';
import './Emotion.less';

export const ChatInputEmotion: React.FC = React.memo(() => {
  const actionContext = useChatInputActionContext();
  const { appendMsg } = actionContext;

  return (
    <BaseChatInputButton
      overlayClassName="emotion-popover"
      icon="mdi:emoticon-happy-outline"
      popoverContent={({ hidePopover }) => (
        <EmojiPanel
          onSelect={(code) => {
            appendMsg(code);
            hidePopover();
          }}
        />
      )}
    />
  );
});
ChatInputEmotion.displayName = 'ChatInputEmotion';
