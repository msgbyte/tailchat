import { FileSelector } from '@/components/FileSelector';
import {
  getMessageTextDecorators,
  pluginChatInputActions,
} from '@/plugin/common';
import { Icon } from 'tailchat-design';
import { Dropdown, Menu } from 'antd';
import React, { useState } from 'react';
import { t } from 'tailchat-shared';
import { useChatInputActionContext } from './context';
import { uploadMessageFile, uploadMessageImage } from './utils';
import clsx from 'clsx';

export const ChatInputAddon: React.FC = React.memo(() => {
  const [open, setOpen] = useState(false);
  const actionContext = useChatInputActionContext();
  if (actionContext === null) {
    return null;
  }

  const handleSendImage = (files: FileList) => {
    // 发送图片
    const image = files[0];
    if (image) {
      // 发送图片
      uploadMessageImage(image).then(({ url, width, height }) => {
        actionContext.sendMsg(
          getMessageTextDecorators().image(url, { width, height })
        );
      });
    }
  };

  const handleSendFile = (files: FileList) => {
    // 发送文件
    const file = files[0];
    if (file) {
      // 发送图片
      uploadMessageFile(file).then(({ name, url }) => {
        actionContext.sendMsg(
          getMessageTextDecorators().card(name, { type: 'file', url })
        );
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

      <FileSelector onSelected={handleSendFile}>
        <Menu.Item>{t('发送文件')}</Menu.Item>
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
    <Dropdown
      overlay={menu}
      open={open}
      onOpenChange={setOpen}
      placement="topRight"
      trigger={['click']}
    >
      <div>
        <Icon
          className={clsx('text-2xl cursor-pointer transition transform', {
            'rotate-45': open,
          })}
          icon="mdi:plus-circle-outline"
        />
      </div>
    </Dropdown>
  );
});
ChatInputAddon.displayName = 'ChatInputAddon';
