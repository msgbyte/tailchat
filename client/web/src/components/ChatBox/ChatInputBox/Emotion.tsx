import { Icon } from 'tailchat-design';
import { Dropdown } from 'antd';
import React, { useCallback, useState } from 'react';
import { useChatInputActionContext } from './context';
import { EmojiPanel } from '@/components/Emoji';

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

  const menu = <EmojiPanel onSelect={handleSelect} />;

  return (
    <Dropdown
      visible={visible}
      onVisibleChange={setVisible}
      overlay={menu}
      placement="topRight"
      trigger={['click']}
    >
      <Icon
        className="text-2xl cursor-pointer"
        icon="mdi:emoticon-happy-outline"
      />
    </Dropdown>
  );
});
ChatInputEmotion.displayName = 'ChatInputEmotion';
