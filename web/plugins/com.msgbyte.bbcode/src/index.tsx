import React from 'react';
import { regMessageRender } from '@capital/common';
import { BBCode } from './bbcode';
import './tags/__all__';

regMessageRender((message) => {
  return <BBCode plainText={message} />;
});
