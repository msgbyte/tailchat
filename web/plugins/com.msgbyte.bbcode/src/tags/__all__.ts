import { registerBBCodeTag } from '../bbcode/parser';
import { CodeTag } from './CodeTag';
import { ImgTag } from './ImgTag';
import { MentionTag } from './MentionTag';
import { PlainText } from './PlainText';
import { UrlTag } from './UrlTag';
import { EmojiTag } from './EmojiTag';

import './styles.less';

registerBBCodeTag('_text', PlainText);
registerBBCodeTag('url', UrlTag);
registerBBCodeTag('img', ImgTag);
registerBBCodeTag('code', CodeTag);
registerBBCodeTag('at', MentionTag);
registerBBCodeTag('emoji', EmojiTag);
