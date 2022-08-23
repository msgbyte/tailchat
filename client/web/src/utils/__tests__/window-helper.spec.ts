import { buildWindowFeatures } from '../window-helper';

describe('window-helper', () => {
  describe('buildWindowFeatures', () => {
    test.each([
      [{ foo: 'bar' }, 'foo=bar'],
      [{ foo: 'bar', baz: 'qux' }, 'foo=bar,baz=qux'],
      [{ foo: 'bar', baz: 1 }, 'foo=bar,baz=1'],
      [{ foo: 'bar', baz: true }, 'foo=bar,baz=true'],
    ])('%p => %s', (input, output) => {
      expect(buildWindowFeatures(input)).toBe(output);
    });
  });
});
