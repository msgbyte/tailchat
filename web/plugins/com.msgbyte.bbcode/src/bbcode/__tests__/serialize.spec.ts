import { bbcodeToPlainText } from '../serialize';

describe('bbcodeToPlainText should be ok', () => {
  test.each([
    ['normal', 'normal'],
    ['with space', 'with space'],
    ['image [img]http://image.url[/img]', 'image [图片]'],
    ['url [url]http://link.url[/url]', 'url http://link.url'],
    ['url2 [url=http://baidu.com]a[/url]', 'url2 a'],
    ['at [at=uuid]name[/at]', 'at @name'],
    ['[emoji]smile[/emoji]', ':smile:'],
  ])('%s', (input, output) => {
    const plain = bbcodeToPlainText(input);

    expect(output).toBe(plain);
  });
});
