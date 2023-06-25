import loadable from '@loadable/component';

export const MarkdownEditor = loadable(() =>
  import('./editor').then((module) => module.MarkdownEditor)
);
