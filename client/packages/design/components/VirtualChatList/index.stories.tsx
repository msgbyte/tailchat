import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { VirtualChatList } from '.';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Tailchat/VirtualChatList',
  component: VirtualChatList,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof VirtualChatList>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof VirtualChatList> = (args) => (
  <VirtualChatList {...args} />
);

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  text: 'fooooo',
};
