import webWebpackConfig from '../../../web/build/webpack.config';
import type { Configuration } from 'webpack';
import webpackPaths from './webpack.paths';

export function getWebTailchatWebpackConfig(): Configuration {
  return {
    ...webWebpackConfig,
    plugins: webWebpackConfig.plugins?.filter(
      (p) => !['GenerateSW'].includes(p.constructor.name)
    ),
    output: {
      path: webpackPaths.distRendererPath,
      filename: '[name].[contenthash].js',
      publicPath: '/',
    },
    target: ['web', 'electron-renderer'],
  };
}
