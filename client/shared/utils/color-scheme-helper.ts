import { isValidStr } from './string-helper';

/**
 * 解析配色方案，优先dark模式
 */
export function parseColorScheme(colorScheme: string): {
  isDarkMode: boolean;
  extraSchemeName: string | null;
} {
  if (colorScheme === 'dark') {
    return {
      isDarkMode: true,
      extraSchemeName: null,
    };
  } else if (colorScheme === 'light') {
    return {
      isDarkMode: false,
      extraSchemeName: null,
    };
  } else if (colorScheme === 'auto') {
    return {
      isDarkMode: window.matchMedia
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : true,
      extraSchemeName: null,
    };
  } else {
    // 可能是插件 for example: dark+miku
    let [base, name] = colorScheme.split('+');

    if (!isValidStr(name)) {
      name = base;
      base = 'dark';
    }

    return {
      isDarkMode: base === 'dark',
      extraSchemeName: `theme-${name}`,
    };
  }
}
