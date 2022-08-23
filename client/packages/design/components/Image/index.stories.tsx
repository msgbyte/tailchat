import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Image } from '.';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Tailchat/Image',
  component: Image,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof Image>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Image> = (args) => (
  <>
    <Image
      src={'https://source.unsplash.com/collection/94734566/1920x1080'}
      {...args}
    />
    <div>一个简单的图片, 自带Fallback机制</div>
  </>
);

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  preview: true,
  width: 640,
  height: 360,
};

export const Fallback = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Fallback.args = {
  src: '',
};
