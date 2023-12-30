import { getMessageTextDecorators } from '@/plugin/common';
import { isEmojiCode, stripColons } from '../Emoji/utils';

const emojiNameRegex = /:([a-zA-Z0-9_\-\+]+):/g;

/**
 * 预加工待发送的消息
 */
export function preprocessMessage(message: string): string {
  message = String(message).trim();

  /**
   * 预加工emoji
   */
  message = message.replace(emojiNameRegex, (matched) => {
    const code = stripColons(matched);
    if (isEmojiCode(code)) {
      return getMessageTextDecorators().emoji(code);
    } else {
      return matched;
    }
  });

  return message;
}
