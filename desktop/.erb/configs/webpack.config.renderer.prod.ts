import type { Configuration } from 'webpack';
import { getWebTailchatWebpackConfig } from './utils';
import webpackPaths from './webpack.paths';

const webWebpackConfig = getWebTailchatWebpackConfig();

const configuration: Configuration = {
  ...webWebpackConfig,
  resolveLoader: {
    alias: {
      'source-ref-loader': require.resolve(
        '../../../packages/source-ref-loader/src/index.ts'
      ),
    },
  },
  target: ['web', 'electron-renderer'],
  mode: 'production',
  output: {
    path: webpackPaths.distRendererPath,
    publicPath: './',
    filename: '[name].[contenthash].js',
    library: {
      type: 'umd',
    },
  },
};

export default configuration;
