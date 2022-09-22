import 'webpack-dev-server';
import type { Configuration } from 'webpack';
import { spawn } from 'child_process';
import { getWebTailchatWebpackConfig } from './utils';

require('dotenv').config();

const port = process.env.PORT || 1212;

const webWebpackConfig = getWebTailchatWebpackConfig();

const configuration: Configuration = {
  ...webWebpackConfig,
  entry: [
    `webpack-dev-server/client?http://localhost:${port}/dist`,
    'webpack/hot/only-dev-server',
    webWebpackConfig.entry?.['app'],
  ],
  devServer: {
    port,
    compress: true,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    static: {
      publicPath: '/',
    },
    historyApiFallback: {
      verbose: true,
    },
    setupMiddlewares(middlewares) {
      console.log('Starting preload.js builder...');
      const preloadProcess = spawn('npm', ['run', 'start:preload'], {
        shell: true,
        stdio: 'inherit',
      })
        .on('close', (code: number) => process.exit(code!))
        .on('error', (spawnError) => console.error(spawnError));

      console.log('Starting Main Process...');
      spawn('npm', ['run', 'start:main'], {
        shell: true,
        stdio: 'inherit',
      })
        .on('close', (code: number) => {
          preloadProcess.kill();
          process.exit(code!);
        })
        .on('error', (spawnError) => console.error(spawnError));
      return middlewares;
    },
  },
};

export default configuration;
