import { regMessageTextDecorators } from '@/plugin/common';
import { preprocessMessage } from '../preprocessMessage';

regMessageTextDecorators(() => ({
  emoji: (code) => `[emoji]${code}[/emoji]`,
}));

describe('preprocessMessage', () => {
  test('should be transform emoji code', () => {
    expect(preprocessMessage('anystring :robot_face: anystring :heart:')).toBe(
      'anystring [emoji]robot_face[/emoji] anystring [emoji]heart[/emoji]'
    );
  });

  test('should ignore non-emoji code between ::', () => {
    expect(preprocessMessage('2023-12-31 01:11:17')).toBe(
      '2023-12-31 01:11:17'
    );
  });
});
