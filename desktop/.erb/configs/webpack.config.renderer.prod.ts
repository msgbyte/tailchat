import type { Configuration } from 'webpack';
import { getWebTailchatWebpackConfig } from './utils';

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
};

export default configuration;
