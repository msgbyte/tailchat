import { chatInputActions } from '@/plugin/common';
import { Icon } from '@iconify/react';
import { Dropdown, Menu } from 'antd';
import React from 'react';
import { useChatInputActionContext } from './context';

export const ChatInputAddon: React.FC = React.memo(() => {
  const actionContext = useChatInputActionContext();

  if (chatInputActions.length === 0) {
    return null;
  }

  if (actionContext === null) {
    return null;
  }

  const menu = (
    <Menu>
      {chatInputActions.map((item, i) => (
        <Menu.Item
          key={item.label + i}
          onClick={() => item.onClick(actionContext)}
        >
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} placement="topRight" trigger={['click']}>
      <Icon
        className="text-2xl cursor-pointer"
        icon="mdi:plus-circle-outline"
      />
    </Dropdown>
  );
});
ChatInputAddon.displayName = 'ChatInputAddon';
