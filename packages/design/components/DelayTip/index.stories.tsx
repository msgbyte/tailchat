import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { DelayTip } from '.';

export default {
  title: 'Tailchat/DelayTip',
  component: DelayTip,
  argTypes: {},
} as ComponentMeta<typeof DelayTip>;

const Template: ComponentStory<typeof DelayTip> = (args) => (
  <DelayTip {...args}>鼠标移动到这里等待1s</DelayTip>
);

export const Default = Template.bind({});
Default.args = {
  title: 'Hello World',
};
