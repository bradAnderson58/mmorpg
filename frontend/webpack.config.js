const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

var API_URL = {
  production: JSON.stringify('http://54.193.125.233:8000/'),
  development: JSON.stringify('http://localhost:8000/')
};
var WS_URL = {
  production: JSON.stringify('ws:/54.193.125.233:8000/'),
  development: JSON.stringify('ws:/127.0.0.1:8000/')
};

module.exports = env => {
  const api = (env && env.production) ? API_URL.production : API_URL.development;
  const ws = (env && env.production) ? WS_URL.production : WS_URL.development;

  return {
    entry: {
      app: './src/main.ts',
      vendors: ['phaser']
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.html/,
          use: 'file-loader'
        },
        {
          test: /\.(gif|png|jpe?g|svg|xml)$/i,
          use: "file-loader"
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: 'file-loader'
        },
        {
          test: /\.(mp3|ogg)$/,
          use: 'file-loader'
        }
      ]
    },

    devtool: 'inline-source-map',

    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },

    output: {
      filename: 'app.bundle.js',
      path: path.resolve(__dirname, 'dist')
    },

    mode: 'development',

    devServer: {
      contentBase: path.resolve(__dirname, 'dist'),
      https: false
    },

    plugins: [
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, 'src/index.html'),
          to: path.resolve(__dirname, 'dist')
        }
      ]),
      new webpack.DefinePlugin({
        'typeof CANVAS_RENDERER': JSON.stringify(true),
        'typeof WEBGL_RENDERER': JSON.stringify(true),
        'API_URL': api,
        'WS_URL': ws,
      }),
    ],

    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    }
  }
};