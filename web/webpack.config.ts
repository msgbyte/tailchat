/**
 * Reference: https://webpack.js.org/configuration/configuration-languages/
 */

import type { Configuration } from 'webpack';
import type WebpackDevServer from 'webpack-dev-server';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const ROOT_PATH = path.resolve(__dirname, './');
const DIST_PATH = path.resolve(ROOT_PATH, './dist');
const ASSET_PATH = process.env.ASSET_PATH || '/';

declare module 'webpack' {
  interface Configuration {
    devServer?: WebpackDevServer.Configuration;
  }
}

const mode =
  process.env.NODE_ENV === 'development' ? 'development' : 'production';

const config: Configuration = {
  mode,
  entry: {
    app: './src/index.tsx',
  },
  output: {
    path: DIST_PATH,
    filename: '[name].[contenthash].js',
    publicPath: ASSET_PATH,
  },
  devServer: {
    port: 11011,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx',
          target: 'es2015',
        },
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: path.resolve(ROOT_PATH, 'postcss.config.js'),
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'PawChat',
      inject: true,
      hash: true,
      template: path.resolve(ROOT_PATH, './assets/template.html'),
    }),
  ],
};

export default config;
