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
  mode: 'production',
};

export default configuration;
