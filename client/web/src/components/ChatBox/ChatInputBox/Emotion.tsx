import { Icon } from 'tailchat-design';
import { Popover } from 'antd';
import React, { useCallback, useState } from 'react';
import { useChatInputActionContext } from './context';
import { EmojiPanel } from '@/components/Emoji';
import './Emotion.less';

export const ChatInputEmotion: React.FC = React.memo(() => {
  const actionContext = useChatInputActionContext();
  const { appendMsg } = actionContext;

  const [visible, setVisible] = useState(false);

  const handleSelect = useCallback(
    async (code: string) => {
      appendMsg(code);
      setVisible(false);
    },
    [appendMsg]
  );

  const content = <EmojiPanel onSelect={handleSelect} />;

  return (
    <Popover
      open={visible}
      onOpenChange={setVisible}
      content={content}
      overlayClassName="chat-message-input_action-popover"
      showArrow={false}
      placement="topRight"
      trigger={['click']}
    >
      <Icon
        className="text-2xl cursor-pointer"
        icon="mdi:emoticon-happy-outline"
      />
    </Popover>
  );
});
ChatInputEmotion.displayName = 'ChatInputEmotion';
