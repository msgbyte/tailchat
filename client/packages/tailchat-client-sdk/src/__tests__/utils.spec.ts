import { stripMentionTag } from '../utils';

describe('stripMentionTag', () => {
  test('simple', () => {
    expect(
      stripMentionTag('[at=6448e822834c12425646f473]Robot[/at] Hello')
    ).toBe('Hello');
  });

  test('not remove other message', () => {
    expect(
      stripMentionTag(
        '[at=6448e822834c12425646f473]Robot[/at] Hello [at=6448e822834c12425646f4732]Robot[/at]'
      )
    ).toBe('Hello [at=6448e822834c12425646f4732]Robot[/at]');
  });

  test('also can remove mention ', () => {
    expect(stripMentionTag('@Robot Hello')).toBe('Hello');
  });
});
