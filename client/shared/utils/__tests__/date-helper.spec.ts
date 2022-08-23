import { isToday, getMessageTimeDiff } from '../date-helper';

describe('isToday', () => {
  test.each([
    [new Date(), true],
    [new Date(new Date().setDate(new Date().getDate() - 1)), false],
  ])('%s => %s', (input, should) => {
    expect(isToday(input)).toBe(should);
  });
});

describe('getMessageTimeDiff', () => {
  test.each([
    [new Date(), '几秒前'],
    [new Date(new Date().setMinutes(new Date().getMinutes() - 1)), '1 分钟前'],
    [new Date(new Date().setHours(new Date().getHours() - 1)), '1 小时前'],
    [new Date('2020-01-01T00:00:00Z'), '2020-01-01 08:00:00'],
  ])('%s => %s', (input, should) => {
    expect(getMessageTimeDiff(input)).toBe(should);
  });
});
