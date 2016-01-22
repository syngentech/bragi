var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

module.exports = {
  entry: {
    bragi: './src/bragi.js',
    docs:  './src/docs.js'
  },
  output: {
    path: './dist',
    publicPath: '/',
    filename: './[name].js'
  },
  externals: [
    {
      jquery: {
        root: 'jQuery',
        commonjs2: 'jquery',
        commonjs: 'jquery',
        amd: 'jquery'
      }
    }
  ],
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
      },
      {
        test: /\.vue$/,
        loader: 'vue'
      }
    ]
  },
  vue: {
    loaders: {
      scss: 'style!css!sass'
    }
  },
  plugins: [
    new ExtractTextPlugin('./[name].css'),
    new CommonsChunkPlugin('bragi', './bragi.js')
  ]
};
