import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { RichEditor } from './editor';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Tailchat/RichEditor',
  component: RichEditor,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof RichEditor>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof RichEditor> = (args) => (
  <div style={{ height: 1000, width: '100%' }}>
    <RichEditor {...args} />
  </div>
);

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  initContent: '<p>Hi <strong>Friend</strong></p>',
};
