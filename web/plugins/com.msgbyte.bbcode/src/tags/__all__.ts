import { registerBBCodeTag } from '../bbcode/parser';
import { PlainText } from './PlainText';
import { UrlTag } from './UrlTag';

registerBBCodeTag('_text', PlainText);
registerBBCodeTag('url', UrlTag);
