import React from 'react';
import {
  Loadable,
  regMessageRender,
  regMessageTextDecorators,
} from '@capital/common';

// 预加载
import('./render');

const BBCode = Loadable(() => import('./render'));
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
  mention: (userId, userName) => `[at=${userId} origin="${userName}"][/at]`, // keep empty content to auto generate with context, useful for friend nickname. NOTE: `origin` is not meaningless just for react-mention to locate text.
  emoji: (emojiCode) => `[emoji]${stripColons(emojiCode)}[/emoji]`,
  serialize: (plain: string) => (serialize ? serialize(plain) : plain),
}));

/**
 * Removes colons on either side
 * of the string if present
 */
function stripColons(str: string): string {
  const colonIndex = str.indexOf(':');
  if (colonIndex > -1) {
    // :emoji: (http://www.emoji-cheat-sheet.com/)
    if (colonIndex === str.length - 1) {
      str = str.substring(0, colonIndex);
      return stripColons(str);
    } else {
      str = str.substr(colonIndex + 1);
      return stripColons(str);
    }
  }

  return str;
}
