module.exports = {
  resolve: { extensions: ['', '.js', '.jsx'] },
  module: { loaders: [
    { test: /\.css$/, loader: 'style!css' },
    { test: /\.jsx$/, loader: 'jsx-loader' },
    { test: /\.json$/, loader: 'json-loader'}
  ] }
}