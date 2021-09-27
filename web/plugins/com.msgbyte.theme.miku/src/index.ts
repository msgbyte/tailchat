import { regPluginColorScheme } from '@capital/common';

regPluginColorScheme({
  label: 'Miku 葱',
  name: 'light+miku',
});

/**
 * 异步加载以防止入口文件过大阻塞主应用加载(因为有图片)
 */
import('./theme.less');
