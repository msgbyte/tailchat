import React from 'react';
/**
 * 富文本编辑器
 */

export const RichEditor = React.lazy(() =>
  import('./editor').then((module) => ({ default: module.RichEditor }))
);
