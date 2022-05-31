import type { Configuration } from 'webpack';
import type { DefaultWebpackConfig } from 'webpack-test-utils';

const loaderPath = require.resolve('../src/index.ts');

export function configureLoader(config: DefaultWebpackConfig & Configuration) {
  config.resolveLoader.alias = {
    'source-ref-loader': loaderPath,
  };

  config.module.rules.push({
    test: /\.tsx$/,
    loader: 'source-ref-loader',
    options: {
      available: true,
    },
  });
}
