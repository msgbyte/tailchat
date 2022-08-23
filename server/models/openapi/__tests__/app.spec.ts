import { filterAvailableAppCapability } from '../app';

describe('openapp', () => {
  describe('filterAvailableAppCapability', () => {
    test.each([
      [['bot'], ['bot']],
      [['bot', 'foo'], ['bot']],
      [
        ['bot', 'webpage', 'oauth'],
        ['bot', 'webpage', 'oauth'],
      ],
      [
        ['bot', 'webpage', 'oauth', 'a', 'b', 'c'],
        ['bot', 'webpage', 'oauth'],
      ],
    ])('%p', (input, output) => {
      expect(filterAvailableAppCapability(input)).toEqual(output);
    });
  });
});
