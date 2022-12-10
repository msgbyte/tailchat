import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { CopyableText } from '.';

export default {
  title: 'Tailchat/CopyableText',
  component: CopyableText,
  argTypes: {
    config: {
      description: '见: https://ant.design/components/typography-cn#copyable',
      defaultValue: true,
    },
  },
} as ComponentMeta<typeof CopyableText>;

const Template: ComponentStory<typeof CopyableText> = (args) => (
  <div>
    可复制文本: <CopyableText {...args} />
    &lt;- 点击此处复制
  </div>
);

export const Default = Template.bind({});
Default.args = {
  children: 'Foo',
};

export const WithConfig = Template.bind({});
WithConfig.args = {
  children: 'Foo',
  config: {
    text: 'Bar',
  },
};
