// 使用 middleware搭建 开发 环境
const express = require('express')
const webpack = require('webpack')
const opn = require('opn')

const app = express()
const port = 3000

const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const ProxyMiddleware = require('http-proxy-middleware')
const historyApiFallback = require('connect-history-api-fallback')

const config = require('./webpack.config.client')('development')

const compiler = webpack(config)

const proxyTable = require('./proxy')

for (let context in proxyTable) {
  app.use(ProxyMiddleware(context, proxyTable[context]))
}
app.use(historyApiFallback({
  index: '/public/index.html',
  // 浏览器URL 重定向 到指定页面
  rewrites: [
    {
      from: /^\/([a-zA-Z0-9]+\/?)([a-zA-Z0-9]+)/,
      to: function (context) {
        return '/' + context.match[1] + context.match[2] + '.html'
      }
    }
  ]
}))

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}))
app.use(webpackHotMiddleware(compiler))
app.listen(port, function () {
  opn('http://localhost:' + port)
  console.log('success listen tp ' + port)
})
