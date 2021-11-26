import { regPluginColorScheme } from '@capital/common';

regPluginColorScheme({
  label: '原神-胡桃',
  name: 'light+genshin-hutao',
});

/**
 * 异步加载以防止入口文件过大阻塞主应用加载(因为有图片)
 */
import('./hutao/theme.less');
