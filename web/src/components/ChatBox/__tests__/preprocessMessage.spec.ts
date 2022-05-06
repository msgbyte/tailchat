import { regMessageTextDecorators } from '@/plugin/common';
import { preprocessMessage } from '../preprocessMessage';

regMessageTextDecorators(() => ({
  emoji: (code) => `[emoji]${code.substring(1, code.length - 1)}[/emoji]`,
}));

test('preprocessMessage', () => {
  expect(preprocessMessage('anystring :face: anystring :heart:')).toBe(
    'anystring [emoji]face[/emoji] anystring [emoji]heart[/emoji]'
  );
});
