import { Loadable } from '../Loadable';

export { Markdown } from './render';

export const MarkdownEditor = Loadable(() =>
  import('./editor').then((module) => module.MarkdownEditor)
);
