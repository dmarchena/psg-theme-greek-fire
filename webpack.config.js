var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    'babel-polyfill', 
    './src/js/index.js'
  ],
  output: {
    path: path.join(__dirname, 'src/.tmp'),
    filename: 'template.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          cacheDirectory: true,
          presets: ['es2015']
        }
      }
    ]
  }
};
