import { chatInputActions } from '@/plugin/common';
import { Icon } from '@iconify/react';
import { Dropdown, Menu } from 'antd';
import React, { useMemo } from 'react';

export const ChatInputAddon: React.FC = React.memo(() => {
  const menu = useMemo(() => {
    return (
      <Menu>
        {chatInputActions.map((item, i) => (
          <Menu.Item key={item.label + i} onClick={item.onClick}>
            {item.label}
          </Menu.Item>
        ))}
      </Menu>
    );
  }, []);

  if (chatInputActions.length === 0) {
    return null;
  }

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
