import { Popover } from 'antd';
import React, { useState } from 'react';
import { Icon } from 'tailchat-design';

interface BaseChatInputButtonProps {
  icon: string;
  popoverContent: (ctx: { hidePopover: () => void }) => React.ReactElement;
}
export const BaseChatInputButton: React.FC<BaseChatInputButtonProps> =
  React.memo((props) => {
    const [visible, setVisible] = useState(false);

    return (
      <Popover
        open={visible}
        onOpenChange={setVisible}
        content={() =>
          props.popoverContent({
            hidePopover: () => {
              setVisible(false);
            },
          })
        }
        overlayClassName="chat-message-input_action-popover"
        showArrow={false}
        placement="topRight"
        trigger={['click']}
      >
        <Icon className="text-2xl cursor-pointer" icon={props.icon} />
      </Popover>
    );
  });
BaseChatInputButton.displayName = 'BaseChatInputButton';
