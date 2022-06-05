import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { AvatarWithPreview } from '.';

export default {
  title: 'Tailchat/AvatarWithPreview',
  component: AvatarWithPreview,
  argTypes: {
    name: {
      description: '显示名称，用于无图片下的展示',
    },
    isOnline: {
      description: '是否在线, 可不传',
    },
    size: {
      description: '图标大小',
      type: 'number',
    },
    src: {
      description: '头像图片地址',
      type: 'string',
    },
  },
} as ComponentMeta<typeof AvatarWithPreview>;

const Template: ComponentStory<typeof AvatarWithPreview> = (args) => (
  <AvatarWithPreview {...args} />
);

export const NoImage = Template.bind({});
NoImage.args = {
  name: 'Anonymous',
};

export const withImage = Template.bind({});
withImage.args = {
  name: 'Anonymous',
  src: 'http://dummyimage.com/50x50',
};
