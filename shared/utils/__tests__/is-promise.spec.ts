import { isPromise } from '../is-promise';

describe('isPromise', () => {
  test.each([
    [Promise.resolve(), true],
    ['str', false],
    [123, false],
    [[], false],
    [{}, false],
    [Symbol('sym'), false],
    [undefined, false],
    [null, false],
  ])('%s => %s', (input, should) => {
    expect(isPromise(input)).toBe(should);
  });
});
