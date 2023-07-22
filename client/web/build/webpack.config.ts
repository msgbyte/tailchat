/**
 * Reference: https://webpack.js.org/configuration/configuration-languages/
 */

import type { Configuration } from 'webpack';
import { DefinePlugin } from 'webpack';
import type WebpackDevServer from 'webpack-dev-server';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import WebpackBar from 'webpackbar';
import fs from 'fs';
import dayjs from 'dayjs';
import { BundleStatsWebpackPlugin } from 'bundle-stats-webpack-plugin';
import { WebpackStatsViewerPlugin } from 'webpack-stats-viewer-plugin';
import { buildWorkboxPlugin } from './workbox';
import { RetryChunkLoadPlugin } from 'webpack-retry-chunk-load-plugin';
import GenerateJsonPlugin from 'generate-json-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

delete process.env.TS_NODE_PROJECT; // https://github.com/dividab/tsconfig-paths-webpack-plugin/issues/32
require('../../build/script/buildPublicTranslation.js'); // 编译前先执行一下构建翻译的脚本

const ROOT_PATH = path.resolve(__dirname, '../');
const DIST_PATH = path.resolve(ROOT_PATH, './dist');
const ASSET_PATH = process.env.ASSET_PATH || '/';
const PORT = Number(process.env.PORT || 11011);
const ANALYSIS = process.env.ANALYSIS === 'true';

declare module 'webpack' {
  interface Configuration {
    devServer?: WebpackDevServer.Configuration;
  }
}

const NODE_ENV = process.env.NODE_ENV ?? 'production';
const PREF_REPORT = !!process.env.PREF_REPORT;
const VERSION =
  process.env.VERSION || `nightly-${dayjs().format('YYYYMMDDHHmm')}`;
const SERVICE_URL = process.env.SERVICE_URL; // 如果不传则为当前服务，用于前后端分离的场景

const isDev = NODE_ENV === 'development';
const mode = isDev ? 'development' : 'production';

const plugins: Configuration['plugins'] = [
  new DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    'process.env.SERVICE_URL': JSON.stringify(SERVICE_URL),
    'process.env.VERSION': JSON.stringify(VERSION),
  }),
  new HtmlWebpackPlugin({
    inject: 'body',
    hash: false,
    favicon: path.resolve(ROOT_PATH, './assets/images/favicon.ico'),
    template: path.resolve(ROOT_PATH, './assets/template.html'),
    preloadImage: `data:image/svg+xml;base64,${Buffer.from(
      fs.readFileSync(path.resolve(ROOT_PATH, './assets/images/ripple.svg'), {
        encoding: 'utf-8',
      })
    ).toString('base64')}`,
  }),
  new CopyPlugin({
    patterns: [
      {
        from: path.resolve(ROOT_PATH, '../locales'),
        to: 'locales',
      },
      {
        from: path.resolve(ROOT_PATH, './registry.json'),
        to: 'registry.json',
      },
      {
        from: path.resolve(ROOT_PATH, './assets/pwa.webmanifest'),
        to: 'pwa.webmanifest',
      },
      {
        from: path.resolve(ROOT_PATH, './assets/images/logo/'),
        to: 'images/logo/',
      },
      {
        from: path.resolve(ROOT_PATH, './assets/images/avatar/'),
        to: 'images/avatar/',
      },
      {
        from: path.resolve(ROOT_PATH, '../../vercel.json'),
        to: 'vercel.json',
      },
    ],
  }) as any,
  new GenerateJsonPlugin('tailchat.manifest', {
    version: VERSION,
    env: NODE_ENV,
    serviceUrl: SERVICE_URL,
  }),
  new MiniCssExtractPlugin({ filename: 'styles-[contenthash].css' }),
  new RetryChunkLoadPlugin({
    maxRetries: 2,
  }),
  buildWorkboxPlugin(isDev),
  new WebpackBar({
    name: `Tailchat`,
  }),
];

if (ANALYSIS) {
  plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: true,
    }) as any,
    new BundleStatsWebpackPlugin(),
    new WebpackStatsViewerPlugin({
      open: true,
    })
  );
}

if (PREF_REPORT) {
  const PerfseePlugin = require('@perfsee/webpack').PerfseePlugin;
  plugins.push(
    new PerfseePlugin({
      project: 'tailchat',
    })
  );
}

const splitChunks: Required<Configuration>['optimization']['splitChunks'] = {
  chunks: 'async',
  minSize: 20000,
  minRemainingSize: 0,
  minChunks: 1,
  maxAsyncRequests: 30,
  maxInitialRequests: 30,
  enforceSizeThreshold: 50000,
  cacheGroups: {
    vendors: {
      chunks: 'initial',
      name: 'vendors',
      test: /[\\/]node_modules[\\/]/,
      priority: -10,
      reuseExistingChunk: true,
      maxSize: 2 * 1000 * 1000,
    },
    default: {
      minChunks: 2,
      priority: -20,
      reuseExistingChunk: true,
    },
  },
};

const config: Configuration = {
  mode,
  entry: {
    app: path.resolve(ROOT_PATH, './src/index.tsx'),
  },
  output: {
    path: DIST_PATH,
    filename: '[name].[contenthash].js',
    publicPath: ASSET_PATH,
  },
  devServer: {
    open: false,
    port: PORT,
    historyApiFallback: true,
    static: {
      directory: path.resolve(ROOT_PATH, './dist'),
    },
    client: {
      overlay: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'tsx',
              target: 'es2015',
              tsconfigRaw: require('../tsconfig.json'),
            },
          },
          {
            loader: 'source-ref-loader',
            options: {
              available: isDev,
            },
          },
        ],
      },
      {
        test: /\.(less|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              // https://github.com/webpack-contrib/css-loader#auto
              modules: {
                auto: /\.module\.\w+$/i,
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
              },
              sourceMap: process.env.NODE_ENV !== 'production',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: path.resolve(ROOT_PATH, 'postcss.config.js'),
              },
            },
          },
          {
            loader: 'less-loader',
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|woff|woff2|svg|eot|ttf|webp|webm)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'assets/[name].[hash:7].[ext]',
        },
      },
    ],
  },
  optimization: {
    splitChunks,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        minify: TerserPlugin.esbuildMinify,
      }),
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(ROOT_PATH, './tsconfig.json'),
      }),
    ],
    fallback: {
      url: require.resolve('url/'),
    },
  },
  plugins,
};

export default config;
