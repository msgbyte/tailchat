import {
  workboxPluginEntryPattern,
  workboxPluginDetailPattern,
} from '../utils';

describe('workboxPluginEntryPattern', () => {
  test.each([
    // 缓存case
    ['/plugins/com.msgbyte.foo/index.js', true],
    ['/plugins/com.msgbyte.foo/bar/index.js', true],

    // 不缓存case
    ['/plugins/com.msgbyte.foo/index-abcde.js', false],
    ['/plugins/com.msgbyte.foo/index.woff', false],
    ['/plugins/com.msgbyte.foo/font.woff', false],
    ['/plugins/a/b/c/d/e/f/g.js', false],
  ])('%s: %p', (input, output) => {
    expect(workboxPluginEntryPattern.test(input)).toBe(output);
  });
});

describe('workboxPluginDetailPattern', () => {
  test.each([
    // 缓存case
    ['/plugins/com.msgbyte.foo/index-abcde.js', true],
    ['/plugins/com.msgbyte.foo/bar-a0c1e.js', true],
    ['/plugins/com.msgbyte.foo.foz/bar-a0c1e.js', true],
    ['/plugins/com.msgbyte.foo/a/b/c/d/e/f/bar-a0c1e.js', true],

    // 不缓存case
    ['/plugins/com.msgbyte.foo/index.js', false],
    ['/plugins/com.msgbyte.foo/index.woff', false],
    ['/plugins/com.msgbyte.foo/font.woff', false],
    ['/plugins/a/b/c/d/e/f/g.js', false],
  ])('%s: %p', (input, output) => {
    expect(workboxPluginDetailPattern.test(input)).toBe(output);
  });
});
