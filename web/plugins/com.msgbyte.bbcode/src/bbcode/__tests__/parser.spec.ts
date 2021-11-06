import bbcodeParser from '../parser';

describe('bbcode parser', () => {
  test('simple text', () => {
    const ast = bbcodeParser.parse('text');

    expect(ast).toMatchObject(['text']);
  });

  test('simple text in []', () => {
    const ast = bbcodeParser.parse('[text]');

    expect(ast).toMatchObject(['[text]']);
  });

  test('non text in bbcode tag', () => {
    const ast = bbcodeParser.parse('[url][/url]');

    expect(ast).toMatchObject(['[url]']);
  });

  test('space char in bbcode tag', () => {
    const ast = bbcodeParser.parse('[url] [/url]');

    expect(ast).toMatchObject([
      {
        tag: 'url',
        attrs: {},
        content: [' '],
      },
    ]);
  });

  describe('tag url', () => {
    test('with plain text', () => {
      const ast = bbcodeParser.parse('[url]http://baidu.com[/url]');

      expect(ast).toMatchObject([
        {
          tag: 'url',
          attrs: {},
          content: ['http://baidu.com'],
        },
      ]);
    });

    test('with custom text', () => {
      const ast = bbcodeParser.parse('[url=http://baidu.com]a[/url]');

      expect(ast).toMatchObject([
        {
          tag: 'url',
          attrs: { url: 'http://baidu.com' },
          content: ['a'],
        },
      ]);
    });
  });
});
