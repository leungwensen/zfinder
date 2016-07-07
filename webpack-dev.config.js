var lang = require('zero-lang');
var webpackConf = require('./webpack.config');

module.exports = lang.extend({
  devServer: {
    stats: {
      cached: false,
      exclude: [
        /node_modules[\\\/]/
      ],
      colors: true
    }
  },
  devtool: 'source-map',
}, webpackConf);
