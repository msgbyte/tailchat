import { isValidJson } from '../json-helper';

describe('isValidJson', () => {
  test.each([
    ['foo', false],
    ['[]', true],
    ['{}', true],
    ['{"foo": []}', true],
    ['{"foo": [}', false],
    ['{foo: bar}', false],
    ['{"foo": "bar"}', true],
    [[], false],
    [null, false],
    [undefined, false],
  ])('%s => %s', (input: any, should) => {
    expect(isValidJson(input)).toBe(should);
  });
});
