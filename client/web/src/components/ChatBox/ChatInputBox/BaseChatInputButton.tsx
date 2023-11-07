import { Popover } from 'antd';
import clsx from 'clsx';
import React, { useState } from 'react';
import { Icon } from 'tailchat-design';
import './BaseChatInputButton.less';

interface BaseChatInputButtonProps {
  overlayClassName?: string;
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
        overlayClassName={clsx(
          'chat-message-input_action-popover',
          props.overlayClassName
        )}
        showArrow={false}
        placement="topRight"
        trigger={['click']}
      >
        <Icon className="text-2xl cursor-pointer" icon={props.icon} />
      </Popover>
    );
  });
BaseChatInputButton.displayName = 'BaseChatInputButton';
