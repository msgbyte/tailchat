import { registerBBCodeTag } from '../bbcode/parser';
import { CodeTag } from './CodeTag';
import { ImgTag } from './ImgTag';
import { MentionTag } from './MentionTag';
import { PlainText } from './PlainText';
import { UrlTag } from './UrlTag';
import { EmojiTag } from './EmojiTag';
import { MarkdownTag } from './MarkdownTag';
import { BoldTag } from './BoldTag';
import { ItalicTag } from './ItalicTag';
import { UnderlinedTag } from './UnderlinedTag';
import { DeleteTag } from './DeleteTag';

import './styles.less';

/**
 * Reference: https://en.wikipedia.org/wiki/BBCode
 */
registerBBCodeTag('_text', PlainText);
registerBBCodeTag('b', BoldTag);
registerBBCodeTag('i', ItalicTag);
registerBBCodeTag('u', UnderlinedTag);
registerBBCodeTag('s', DeleteTag);
registerBBCodeTag('url', UrlTag);
registerBBCodeTag('img', ImgTag);
registerBBCodeTag('code', CodeTag);
registerBBCodeTag('at', MentionTag);
registerBBCodeTag('emoji', EmojiTag);
registerBBCodeTag('markdown', MarkdownTag);
registerBBCodeTag('md', MarkdownTag); // alias
