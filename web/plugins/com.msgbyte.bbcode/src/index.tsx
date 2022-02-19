import React from 'react';
import {
  Loadable,
  regMessageRender,
  regMessageTextDecorators,
} from '@capital/common';

const BBCode = Loadable(() => import('./render'));

regMessageRender((message) => {
  return <BBCode plainText={message} />;
});

regMessageTextDecorators(() => ({
  url: (plain) => `[url]${plain}[/url]`,
  image: (plain, attrs) => {
    if (attrs.height && attrs.width) {
      return `[img height=${attrs.height} width=${attrs.width}]${plain}[/img]`;
    }

    return `[img]${plain}[/img]`;
  },
}));
