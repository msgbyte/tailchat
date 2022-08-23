import { getMessageTextDecorators } from '@/plugin/common';

const emojiNameRegex = /:([a-zA-Z0-9_\-\+]+):/g;

/**
 * 预加工待发送的消息
 */
export function preprocessMessage(message: string) {
  /**
   * 预加工emoji
   */
  return message.replace(emojiNameRegex, (code) =>
    getMessageTextDecorators().emoji(code)
  );
}
