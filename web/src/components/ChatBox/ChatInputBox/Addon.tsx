import { FileSelector } from '@/components/FileSelector';
import { pluginChatInputActions } from '@/plugin/common';
import { Icon } from '@iconify/react';
import { Dropdown, Menu } from 'antd';
import React from 'react';
import { t } from 'tailchat-shared';
import { useChatInputActionContext } from './context';
import { uploadMessageImage } from './utils';

export const ChatInputAddon: React.FC = React.memo(() => {
  const actionContext = useChatInputActionContext();
  if (actionContext === null) {
    return null;
  }

  const handleSendImage = (files: FileList) => {
    // 发送图片
    const image = files[0];
    if (image) {
      // 发送图片
      uploadMessageImage(image).then((imageRemoteUrl) => {
        // TODO: not good, should bind with plugin bbcode
        actionContext.sendMsg(`[img]${imageRemoteUrl}[/img]`);
      });
    }
  };

  const menu = (
    <Menu>
      <FileSelector
        fileProps={{ accept: 'image/*' }}
        onSelected={handleSendImage}
      >
        <Menu.Item>{t('发送图片')}</Menu.Item>
      </FileSelector>

      {pluginChatInputActions.map((item, i) => (
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
