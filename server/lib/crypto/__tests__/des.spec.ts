import { desEncrypt, desDecrypt } from '../des';

describe('des', () => {
  const key = '12345678';

  describe('encrypt', () => {
    test.each([['foo'], ['bar'], ['你'], ['D']])('%s', (input) => {
      expect(desEncrypt(input, key)).toMatchSnapshot();
    });
  });

  describe('decrypt', () => {
    test.each([['foo'], ['bar'], ['你'], ['D']])('%s', (input) => {
      expect(desDecrypt(desEncrypt(input, key), key)).toBe(input);
    });
  });
});
