import { parseColorScheme } from '../color-scheme-helper';

describe('parseColorScheme', () => {
  test.each([
    ['dark', { isDarkMode: true, extraSchemeName: null }],
    ['light', { isDarkMode: false, extraSchemeName: null }],
    ['auto', { isDarkMode: true, extraSchemeName: null }],
    ['dark+miku', { isDarkMode: true, extraSchemeName: 'theme-miku' }],
    ['light+miku', { isDarkMode: false, extraSchemeName: 'theme-miku' }],
    ['miku', { isDarkMode: true, extraSchemeName: 'theme-miku' }],
  ])('%s', (input, output) => {
    expect(parseColorScheme(input)).toEqual(output);
  });
});
