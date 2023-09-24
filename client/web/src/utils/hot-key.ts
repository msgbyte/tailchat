import { isHotkey } from 'is-hotkey';

export const isEnterHotkey = isHotkey('enter');

export const isSpaceHotkey = isHotkey('space');

export const isEscHotkey = isHotkey('esc');

export const isQuickSwitcher = isHotkey('mod+k');

export const isArrowUp = isHotkey('up');

export const isArrowDown = isHotkey('down');

/**
 * 判断输入是否是字母
 */
export function isAlphabetHotkey(e: KeyboardEvent) {
  const key = e.key;

  return /[a-zA-Z]/.test(key);
}
