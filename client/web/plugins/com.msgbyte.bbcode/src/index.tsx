import React from 'react';
import {
  Loadable,
  regMessageRender,
  regMessageTextDecorators,
} from '@capital/common';

const PLUGIN_ID = 'com.msgbyte.bbcode';

// 预加载
import('./render');

const BBCode = Loadable(() => import('./render'), {
  componentName: `${PLUGIN_ID}:renderComponent`,
  fallback: null,
});
let serialize: (bbcode: string) => string;
import('./bbcode/serialize').then((module) => {
  serialize = module.bbcodeToPlainText;
});

regMessageRender((message) => {
  return <BBCode plainText={message} />;
});

regMessageTextDecorators(() => ({
  url: (url, label?) =>
    label ? `[url=${url}]${label}[/url]` : `[url]${url}[/url]`,
  image: (plain, attrs) => {
    if (attrs.height && attrs.width) {
      return `[img height=${attrs.height} width=${attrs.width}]${plain}[/img]`;
    }

    return `[img]${plain}[/img]`;
  },
  card: (plain, attrs) => {
    const h = [
      'card',
      ...Object.entries(attrs).map(([k, v]) => `${k}=${v}`),
    ].join(' ');

    return `[${h}]${plain}[/card]`;
  },
  mention: (userId, userName) => `[at=${userId}]${userName}[/at]`,
  emoji: (emojiCode) => `[emoji]${emojiCode}[/emoji]`,
  serialize: (plain: string) => (serialize ? serialize(plain) : plain),
}));
