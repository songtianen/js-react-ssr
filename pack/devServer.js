// const path = require('path')
module.exports = {
  host: '0.0.0.0',
  port: 8888,
  // contentBase: path.join(__dirname, '../dist'),
  hot: true,
  publicPath: '/public',
  // hotOnly: true,
  overlay: {
    errors: true
  },
  proxy: {
    '/api':
      {
        target: 'http://localhost:2222'
      }
  },
  historyApiFallback: {
    index: '/public/index.html'
  }
}
