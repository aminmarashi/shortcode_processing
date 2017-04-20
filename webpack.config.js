const path = require('path');
const webpack = require('webpack');
const updateTranslations = require('./custom_plugin/updateTranslations');

const config = {
  entry: './src/longcode.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    library: 'binary-com-longcode',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }, {
          loader: './custom_loader/textExtractor',
          options: {
            output: path.resolve(__dirname, 'translation'),
            method_names: ['translate']
          }
        }]
      }]
  },
  externals: {
    moment: 'moment'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true,
      sourceMap: true
    }),
    /**
     * This plugin updates the translation files and converts them to json format.
     */
    new updateTranslations({
      directory: path.resolve(__dirname, 'translation'), //Path to pot and po files.
      pot: 'messages.pot', //pot file name
      //language files that are to be updated.
      languages: ['de', 'en', 'es', 'fr', 'id', 'it', 'ja', 'pl', 'pt', 'ru', 'th', 'vi', 'zh_cn', 'zh_tw']
    })
  ]
};

module.exports = config;