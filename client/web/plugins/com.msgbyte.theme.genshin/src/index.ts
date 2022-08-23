import { regPluginColorScheme, sharedEvent } from '@capital/common';

regPluginColorScheme({
  label: '原神-胡桃',
  name: 'light+genshin-hutao',
});

regPluginColorScheme({
  label: '原神-琴',
  name: 'light+genshin-jean',
});

regPluginColorScheme({
  label: '原神-安柏',
  name: 'light+genshin-amber',
});

regPluginColorScheme({
  label: '原神-莫娜',
  name: 'light+genshin-mona',
});

regPluginColorScheme({
  label: '原神-罗莎莉亚',
  name: 'light+genshin-rosaria',
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
  } else if (colorSchemeName === 'light+genshin-amber') {
    console.log('正在加载安柏主题...');
    import('./amber/theme.less');
  } else if (colorSchemeName === 'light+genshin-mona') {
    console.log('正在加载莫娜主题...');
    import('./mona/theme.less');
  } else if (colorSchemeName === 'light+genshin-rosaria') {
    console.log('正在加载罗莎莉亚主题...');
    import('./rosaria/theme.less');
  }
});
