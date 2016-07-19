const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
  },
  output: {
    path: path.resolve(__dirname),
    publicPath: '/',
    filename: '[name].js'
  },
  alias: {},
  resolveLoader: {},
  module: {
    loaders: [
      {
        test: /\.js[x]?$/,
        loader: 'babel-loader',
        exclude: /locale/,
        query: {
          presets: [
            'es2015'
          ]
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
      },
      {
        test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i, // images
        loader: 'url?name=[path][name].[ext]'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/, // font files
        loader: 'url?name=[path][name].[ext]'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
    ]
  },
  externals: {
    'jquery': 'jQuery',
    'prism': 'Prism',
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
  ],
};
