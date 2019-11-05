const path = require('path')
const ROOT_PATH = path.resolve(__dirname)
// const SRC_PATH = path.resolve(ROOT_PATH, 'src') // eslint-disable-line
// const BUILD_PATH = path.resolve(ROOT_PATH, 'dist')

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.ejs']
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
      }
    ]
  }
}
