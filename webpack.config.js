'use strict'

/* eslint-env node */

const webpack = require('webpack')
const path = require('path')
const ProgressPlugin = require('webpack/lib/ProgressPlugin')
const env = process.env.NODE_ENV
const isTest = env === 'test'
const isProd = env === 'production'

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(env),
  }),
  new ProgressPlugin({ profile: false }),
]

const externals = isTest
  ? {
      cheerio: 'window',
      'react/addons': true,
      'react/lib/ExecutionEnvironment': true,
      'react/lib/ReactContext': true,
    }
  : {}

module.exports = {
  mode: isProd ? 'production' : 'development',
  devtool: isTest ? 'source-map' : 'eval',
  output: isTest
    ? {
        library: 'reactViewSlider',
        libraryTarget: 'umd',
      }
    : {
        path: path.join(__dirname, 'demo'),
        filename: 'bundle.js',
      },
  plugins,
  resolve: {
    alias: {
      'react-view-slider': path.join(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          cacheDirectory: true,
          plugins: [
            '@babel/plugin-transform-flow-strip-types',
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-proposal-export-default-from',
            '@babel/plugin-proposal-export-namespace-from',
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-proposal-class-properties',
          ],
          presets: [
            ['@babel/preset-env', { targets: { browsers: 'last 2 versions' } }],
            '@babel/preset-react',
            '@babel/preset-flow',
          ],
        },
        test: /\.js$/,
      },
    ],
  },
  externals,
}

if (!isTest) {
  module.exports.entry = ['@babel/polyfill', './demo/index.js']
  module.exports.devServer = {
    port: 3000,
    contentBase: path.join(__dirname, 'demo'),
  }
}
