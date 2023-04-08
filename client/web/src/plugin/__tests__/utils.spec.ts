import { parsePluginManifest } from '../utils';

describe('parsePluginManifest', () => {
  test.each([
    [
      'correct',
      JSON.stringify({
        label: '网页面板插件',
        name: 'com.msgbyte.webview',
        url: '/plugins/com.msgbyte.webview/index.js',
        version: '0.0.0',
        author: 'msgbyte',
        description: '为群组提供创建网页面板的功能',
        requireRestart: false,
      }),
      true,
    ],
    ['string', 'foo.bar', false],
    [
      'no used properties',
      JSON.stringify({
        label: '网页面板插件',
        foo: 'bar',
      }),
      false,
    ],
    [
      'allow i18n properties',
      JSON.stringify({
        label: 'webpanel',
        'label.zh-CN': '网页面板插件',
        name: 'com.msgbyte.webview',
        url: '/plugins/com.msgbyte.webview/index.js',
        version: '0.0.0',
        author: 'msgbyte',
        description: 'Provide groups with the ability to create web panels',
        'description.zh-CN': '为群组提供创建网页面板的功能',
        requireRestart: false,
        foo: 'bar',
      }),
      true,
    ],
    [
      'missed properties',
      JSON.stringify({
        label: '网页面板插件',
      }),
      false,
    ],
  ])('case: %# %s', (title, input, valid) => {
    if (valid === true) {
      expect(parsePluginManifest(input)).toEqual(JSON.parse(input));
    } else {
      expect(() => parsePluginManifest(input)).toThrowError();
    }
  });
});
