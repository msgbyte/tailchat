import { getMessageTextDecorators } from '@/plugin/common';

const emojiNameRegex = /:([a-zA-Z0-9_\-\+]+):/g;

/**
 * 预加工待发送的消息
 */
export function preprocessMessage(message: string): string {
  message = String(message).trim();

  /**
   * 预加工emoji
   */
  message = message.replace(emojiNameRegex, (code) =>
    getMessageTextDecorators().emoji(code)
  );

  return message;
}
