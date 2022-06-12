import webWebpackConfig from '../../../web/build/webpack.config';
import type { Configuration } from 'webpack';

export function getWebTailchatWebpackConfig(): Configuration {
  return {
    ...webWebpackConfig,
    plugins: webWebpackConfig.plugins?.filter(
      (p) => !['GenerateSW'].includes(p.constructor.name)
    ),
  };
}
