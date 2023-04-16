import { Loadable } from '../Loadable';

export const MarkdownEditor = Loadable(() =>
  import('./editor').then((module) => module.MarkdownEditor)
);
