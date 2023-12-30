import { emojiData } from './const';

export function isEmojiCode(code: string): boolean {
  return Object.keys(emojiData.emojis).includes(code);
}

/**
 * Removes colons on either side
 * of the string if present
 */
export function stripColons(str: string): string {
  const colonIndex = str.indexOf(':');
  if (colonIndex > -1) {
    // :emoji: (http://www.emoji-cheat-sheet.com/)
    if (colonIndex === str.length - 1) {
      str = str.substring(0, colonIndex);
      return stripColons(str);
    } else {
      str = str.substr(colonIndex + 1);
      return stripColons(str);
    }
  }

  return str;
}
