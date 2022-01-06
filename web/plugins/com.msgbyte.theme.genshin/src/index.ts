import { regPluginColorScheme, sharedEvent } from '@capital/common';

regPluginColorScheme({
  label: '原神-胡桃',
  name: 'light+genshin-hutao',
});

regPluginColorScheme({
  label: '原神-琴',
  name: 'light+genshin-jean',
});

/**
 * 异步加载以防止入口文件过大阻塞主应用加载(因为有图片)
 */
sharedEvent.on('loadColorScheme', (colorSchemeName) => {
  if (colorSchemeName === 'light+genshin-hutao') {
    console.log('正在加载胡桃主题...');
    import('./hutao/theme.less');
  } else if (colorSchemeName === 'light+genshin-jean') {
    console.log('正在加载琴主题...');
    import('./jean/theme.less');
  }
});
