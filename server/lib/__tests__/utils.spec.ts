import {
  checkPathMatch,
  generateRandomStr,
  getEmailAddress,
  isValidStr,
  sleep,
} from '../utils';

describe('getEmailAddress', () => {
  test.each([
    ['foo@example.com', 'foo'],
    ['foo.bar@example.com', 'foo.bar'],
    ['foo$bar@example.com', 'foo$bar'],
  ])('%s', (input, output) => {
    expect(getEmailAddress(input)).toBe(output);
  });
});

describe('generateRandomStr', () => {
  test('should generate string with length 10(default)', () => {
    expect(generateRandomStr()).toHaveLength(10);
  });

  test('should generate string with manual length', () => {
    expect(generateRandomStr(4)).toHaveLength(4);
  });
});

describe('isValidStr', () => {
  test.each<[any, boolean]>([
    [false, false],
    [true, false],
    [0, false],
    [1, false],
    ['', false],
    [{}, false],
    [[], false],
    ['foo', true],
  ])('%p is %p', (input, output) => {
    expect(isValidStr(input)).toBe(output);
  });
});

test('sleep', async () => {
  const start = new Date().valueOf();
  await sleep(1000);
  const end = new Date().valueOf();

  const duration = end - start;
  expect(duration).toBeGreaterThanOrEqual(1000);
  expect(duration).toBeLessThan(1050);
});

describe('checkPathMatch', () => {
  const testList = ['/foo/bar'];

  test.each([
    ['/foo/bar', true],
    ['/foo/bar?query=1', true],
    ['/foo', false],
    ['/foo/baz', false],
    ['/foo/baz?bar=', false],
  ])('%s', (input, output) => {
    expect(checkPathMatch(testList, input)).toBe(output);
  });
});
