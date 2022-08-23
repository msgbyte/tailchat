import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { AutoFolder } from '.';

export default {
  title: 'Tailchat/AutoFolder',
  component: AutoFolder,
  argTypes: {},
} as ComponentMeta<typeof AutoFolder>;

const Template: ComponentStory<typeof AutoFolder> = (args) => (
  <AutoFolder {...args} />
);

export const Default = Template.bind({});
Default.args = {
  maxHeight: 100,
  children: (
    <div style={{ border: '1px solid #999' }}>
      <div>foooooo</div>
      <div>foooooo</div>
      <div>foooooo</div>
      <div>foooooo</div>
      <div>foooooo</div>
      <div>foooooo</div>
      <div>foooooo</div>
      <div>foooooo</div>
      <div>foooooo</div>
      <div>foooooo</div>
      <div>foooooo</div>
      <div>foooooo</div>
    </div>
  ),
};
