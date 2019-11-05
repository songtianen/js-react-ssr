// 前端服务器（服务端渲染）不能运行 es6 与react的 jsx 文件：
// 所以要用web pack 打包编译 要渲染的内容 server-entry.js
const path = require('path')
const webpack = require('webpack')
const ROOT_PATH = path.resolve(__dirname)
const serverConfig = {
  target: 'node',
  entry: {
    home: path.join(__dirname, '../src/server-entry.js')
  },
  // 一些包不打包到输出的js文件里面
  externals: Object.keys(require('../package.json').dependencies),
  output: {
    path: path.join(ROOT_PATH, '../dist'),
    publicPath: '/public/',
    filename: 'server-entry.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.js', '.jsx', 'ejs']
  },
  module: {
    rules: [
      {
        // loader编译之前，去验证
        enforce: 'pre',
        test: /.(js|jsx)$/,
        loader: 'eslint-loader',
        // 排除
        exclude: [
          path.join(ROOT_PATH, '../node_modules'),
          path.join(ROOT_PATH, '../src/libs')
        ]
      },
      {
        test: /.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: [
          path.join(ROOT_PATH, '../node_modules')
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: { // 通过options 配置路径
              name: '[name].[ext]',
              limit: 10000
              // publicPath: '',
              // outputPath: 'assets/imgs/'

            }
          },
          {
            loader: 'img-loader', // 图片压缩
            options: {
              pngquant: {
                quality: 80
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_BASE': '"http://127.0.0.1:2222"'
    })
  ]

}

module.exports = serverConfig
