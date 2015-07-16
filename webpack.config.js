var webpack = require('webpack');

module.exports = {
  entry: {
    inject: './src/inject.js',
    options: './src/options/options.js',
    background: './src/background.js',
    content: './src/content.js'
  },
  output: {
    path: 'build',
    filename: '[name].js'
  },
  resolve: { extensions: ['', '.js', '.jsx'] },
  module: { 
    loaders: [
      { test: /\.css$/, loader: 'style/useable!css' },
      { test: /\.jsx$/, loader: 'jsx-loader' },
      { test: /\.json$/, loader: 'json-loader'},
      { test: /\.(png|woff|woff2|eot|ttf|svg)(\?.*?)?$/, loader: 'url-loader?limit=100000' }
    ] 
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}