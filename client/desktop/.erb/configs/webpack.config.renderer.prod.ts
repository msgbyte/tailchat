import type { Configuration } from 'webpack';
import { getWebTailchatWebpackConfig } from './utils';

const webWebpackConfig = getWebTailchatWebpackConfig();

const configuration: Configuration = {
  ...webWebpackConfig,
  mode: 'production',
};

export default configuration;
