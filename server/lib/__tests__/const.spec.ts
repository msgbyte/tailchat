import { NAME_REGEXP } from '../const';

describe('NAME_REGEXP', () => {
  describe('allow', () => {
    test.each([
      'test',
      'test01',
      '你好世界',
      '你好world',
      '最大八个汉字内容',
      'maxis16charactor',
      '1234567812345678',
    ])('%s', (input) => {
      expect(NAME_REGEXP.test(input)).toBe(true);
    });
  });

  describe('deny', () => {
    test.each([
      '世 界',
      '你好 world',
      '超过了八个汉字内容',
      'overmax16charactor',
      '12345678123456781',
    ])('%s', (input) => {
      expect(NAME_REGEXP.test(input)).toBe(false);
    });
  });
});
