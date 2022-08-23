import { joinArray } from '../array-helper';

describe('array-helper', () => {
  test('joinArray', () => {
    expect(joinArray([1, 2, 3], '5')).toMatchObject([1, '5', 2, '5', 3]);
    expect(joinArray([{ a: 1 }, { a: 2 }, { a: 3 }], '5')).toMatchObject([
      { a: 1 },
      '5',
      { a: 2 },
      '5',
      { a: 3 },
    ]);
  });
});
