module.exports = {
  entry: {
    inject: './src/inject.js',
    options: './src/options/options.js'
  },
  output: {
    path: 'build',
    filename: '[name].js'
  },
  resolve: { extensions: ['', '.js', '.jsx'] },
  module: { loaders: [
    { test: /\.css$/, loader: 'style!css' },
    { test: /\.jsx$/, loader: 'jsx-loader' },
    { test: /\.json$/, loader: 'json-loader'}
  ] }
}