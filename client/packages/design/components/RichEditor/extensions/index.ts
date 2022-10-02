import {
  BoldExtension,
  CodeExtension,
  ItalicExtension,
  UnderlineExtension,
} from 'remirror/extensions';

/**
 * 富文本编辑器使用的拓展
 */
export const extensions = () => [
  new BoldExtension(),
  new ItalicExtension(),
  new UnderlineExtension(),
  new CodeExtension(),
];
