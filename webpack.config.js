const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname),
    publicPath: '/dist',
    compress: true,
    port: 9000
  }
}