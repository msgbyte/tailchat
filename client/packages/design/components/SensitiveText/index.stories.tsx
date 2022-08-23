import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SensitiveText } from '.';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Tailchat/SensitiveText',
  component: SensitiveText,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof SensitiveText>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SensitiveText> = (args) => (
  <SensitiveText {...args} />
);

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  text: 'fooooo',
};
