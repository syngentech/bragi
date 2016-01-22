var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: {
    bragi: "./src/bragi.js"
  },
  output: {
    filename: "./dist/js/[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
      }
    ]
  },
  plugins: [
      new ExtractTextPlugin("./dist/css/[name].css")
  ]
};
