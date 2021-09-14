import { registerBBCodeTag } from '../bbcode/parser';
import { ImgTag } from './ImgTag';
import { PlainText } from './PlainText';
import { UrlTag } from './UrlTag';

registerBBCodeTag('_text', PlainText);
registerBBCodeTag('url', UrlTag);
registerBBCodeTag('img', ImgTag);
