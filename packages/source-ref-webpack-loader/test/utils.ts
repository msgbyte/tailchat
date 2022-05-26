import type { Configuration } from 'webpack';

const loaderPath = require.resolve('../src/index.ts');

export function configureLoader(config: Configuration) {
  config.resolveLoader.alias = {
    'source-pointer-loader': loaderPath,
  };

  config.module.rules.push({
    test: /\.tsx$/,
    loader: 'source-pointer-loader',
  });
}
