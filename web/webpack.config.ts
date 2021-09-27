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
import fs from 'fs';
import WorkboxPlugin from 'workbox-webpack-plugin';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

delete process.env.TS_NODE_PROJECT; // https://github.com/dividab/tsconfig-paths-webpack-plugin/issues/32
require('../build/script/buildPublicTranslation.js'); // 编译前先执行一下构建翻译的脚本
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('./package.json');

const ROOT_PATH = path.resolve(__dirname, './');
const DIST_PATH = path.resolve(ROOT_PATH, './dist');
const ASSET_PATH = process.env.ASSET_PATH || '/';
const PORT = Number(process.env.PORT || 11011);

declare module 'webpack' {
  interface Configuration {
    devServer?: WebpackDevServer.Configuration;
  }
}

const NODE_ENV = process.env.NODE_ENV ?? 'production';

const isDev = NODE_ENV === 'development';
const mode = isDev ? 'development' : 'production';

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
    port: PORT,
    historyApiFallback: true,
    contentBase: './dist',
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
          tsconfigRaw: require('./tsconfig.json'),
        },
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
        test: /\.(png|jpg|gif|woff|woff2|svg|eot|ttf)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'assets/[name].[hash:7].[ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(ROOT_PATH, './tsconfig.json'),
      }),
    ],
  },
  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
      'process.env.SERVICE_URL': JSON.stringify(process.env.SERVICE_URL),
      'process.env.VERSION': JSON.stringify(
        process.env.VERSION || packageJson.version
      ),
    }),
    new HtmlWebpackPlugin({
      title: 'TailChat',
      inject: true,
      hash: true,
      favicon: path.resolve(ROOT_PATH, './assets/images/logo.svg'),
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
          from: path.resolve(__dirname, '../locales'),
          to: 'locales',
        },
      ],
    }) as any,
    new MiniCssExtractPlugin({ filename: 'styles-[contenthash].css' }),
    new WorkboxPlugin.GenerateSW({
      // https://developers.google.com/web/tools/workbox
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      clientsClaim: true,
      skipWaiting: true,

      // Do not precache images
      exclude: [/\.(?:png|jpg|jpeg|svg)$/],

      // Define runtime caching rules.
      runtimeCaching: [
        {
          // Match any request that ends with .png, .jpg, .jpeg or .svg.
          urlPattern: /\.(?:png|jpg|jpeg|svg)$/,

          // Apply a cache-first strategy.
          handler: 'CacheFirst',

          options: {
            // Use a custom cache name.
            cacheName: 'images',

            // Only cache 10 images.
            expiration: {
              maxEntries: 10,
            },
          },
        },
        {
          // 匹配内置 plugins 以加速
          urlPattern: /plugins\/com\.msgbyte(.*?)\.js/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'builtin-plugins',
            expiration: {
              maxAgeSeconds: 1 * 60 * 60, // 1h
            },
            cacheableResponse: {
              // 只缓存js, 防止404后台直接fallback到html
              headers: {
                'content-type': 'application/javascript; charset=utf-8',
              },
            },
          },
        },
      ],
    }),
  ],
};

export default config;
