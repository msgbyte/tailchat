import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Avatar } from '.';

export default {
  title: 'Tailchat/Avatar',
  component: Avatar,
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
} as ComponentMeta<typeof Avatar>;

const Template: ComponentStory<typeof Avatar> = (args) => <Avatar {...args} />;

export const normal = Template.bind({});
normal.args = {
  name: 'Anonymous',
};

export const withSize = Template.bind({});
withSize.args = {
  name: 'Anonymous',
  size: 48,
};

export const withOnline = Template.bind({});
withOnline.args = {
  name: 'Anonymous',
  isOnline: true,
};

export const withImage = Template.bind({});
withImage.args = {
  name: 'Anonymous',
  src: 'http://dummyimage.com/50x50',
};
