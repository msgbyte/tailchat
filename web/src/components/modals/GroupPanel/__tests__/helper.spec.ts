import { buildDataFromValues } from '../helper';

describe('buildDataFromValues', () => {
  test.each([
    [
      { name: 'name', type: 'type' },
      { name: 'name', type: 'type' },
    ],
  ])('%o', (input, output) => {
    expect(buildDataFromValues(input)).toEqual(output);
  });
});
