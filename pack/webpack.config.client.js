const path = require('path')
const webpack = require('webpack')
// const webpackMerge = require('webpack-merge')
// const baseConfig = require('./webpack.base.js')
// const ExtractTextWbpackPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackplugin = require('html-webpack-plugin')
// const glob = require('glob-all')
// const PurifyCssWebpack = require('purifycss-webpack')
const devServer = require('./devServer')
const ROOT_PATH = path.resolve(__dirname)
const SRC_PATH = path.resolve(ROOT_PATH, 'src') // eslint-disable-line
const BUILD_PATH = path.resolve(ROOT_PATH, 'dist') // eslint-disable-line
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const BabelEnginePlugin = require('babel-engine-plugin')
const NameAllModulesPlugin = require('name-all-modules-plugin')

// 引入 cdn config
const cdnconfig = require('../app.config').cdn

// 判断是否是开发环境，以便配置  热更新等:
const isEnv = process.env.NODE_ENV

// const posscssLoaderPlugin = [
//   require('autoprefixer')(), // 添加css 浏览器内核配置
//   require('postcss-sprites')({
//     spritePath: 'dist/assets/imgs/sprites', // 雪碧图的路径
//     retina: true // 苹果设备用的图片
//   })
// ]

const devConf = {
  resolve: {
    extensions: ['.js', '.jsx', '.ejs']
  },
  entry: {
    home: path.join(ROOT_PATH, '../src/index.js')
  },
  output: {
    // path: path.join(ROOT_PATH, '../dist'),
    publicPath: '/public/',
    // 达到浏览器最长的缓存的目的
    filename: '[name].js'
  },
  devtool: '#cheap-module-eval-source-map',
  devServer: devServer,
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
      // {
      //   test: /\.less$/,
      //   // use: ExtractTextWbpackPlugin.extract({
      //   //   // 当不提取css用 style-loader
      //   //   fallback: {
      //   //     loader: 'style-loader'
      //   //   },
      //   use: [
      //     {
      //       loader: 'style-loader'
      //     },
      //     {
      //       loader: 'css-loader',
      //       options: {
      //         sourceMap: true,
      //         minimize: false,
      //         modules: false
      //       }
      //     },
      //     // {
      //     //   loader: 'postcss-loader',
      //     //   options: {
      //     //     sourceMap: true,
      //     //     ident: 'posscss-loader', // 声明 后面的插件是给css 用的。
      //     //     plugins: posscssLoaderPlugin
      //     //   }
      //     // },
      //     {
      //       loader: 'less-loader', // use 是从后往前处理的
      //       options: {
      //         sourceMap: true

      //       }
      //     }
      //   ]
      //   // })
      // },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: { // 通过options 配置路径
              name: '[name].[ext]',
              limit: 10000,
              // publicPath: '',
              outputPath: 'assets/imgs/'

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
      // {
      //   test: /\.(eot|woff2?|ttf|svg|otf)$/,
      //   use: [
      //     {
      //       loader: 'url-loader',
      //       options: {
      //         name: '[name].[ext]',
      //         limit: 10000,
      //         // publicPath: '',
      //         outputPath: 'assets/fonts/'
      //       }
      //     }
      //   ]
      // }
      // {
      //   test: /\.html$/,
      //   use: [
      //     {
      //       loader: 'html-loader',
      //       options: {
      //         attrs: ['img:src', 'img:data-src']
      //       }
      //     }
      //   ]
      // }
    ]
  },
  plugins: [
    // 生产环境与开发环境都会用到
    new HtmlWebpackplugin({
      filename: 'index.html',
      template: path.join(__dirname, '../src/template.html')
    }),
    // @:abs:新建一个模版,服务端渲染的内容插入到模版中
    new HtmlWebpackplugin({
      template: '!!ejs-compiled-loader!' + path.join(ROOT_PATH, '../src/server-template.ejs'),
      filename: 'server.ejs'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}
const prodConf = {
  resolve: {
    extensions: ['.js', '.jsx', '.ejs']
  },
  entry: {
    home: path.join(ROOT_PATH, '../src/index.js'),
    vendor: [
      'react',
      'react-dom',
      'react-router-dom',
      'mobx',
      'mobx-react',
      'axios',
      'query-string',
      'dateformat',
      'marked'
    ]
  },
  output: {
    path: path.resolve(ROOT_PATH, '../dist'),
    publicPath: cdnconfig.host,
    filename: '[name].[chunkhash].js'
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
        test: /.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: [
          path.join(ROOT_PATH, '../node_modules')
        ]
      },
      // {
      //   test: /.(js|jsx)$/,
      //   loader: 'babel-loader',
      //   exclude: [
      //     path.join(ROOT_PATH, '../node_modules')
      //   ]
      // },
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
    new webpack.optimize.UglifyJsPlugin(),
    // new BundleAnalyzerPlugin(), // 包分析器
    // 生产环境与开发环境都会用到
    new HtmlWebpackplugin({
      filename: 'index.html',
      template: path.join(__dirname, '../src/template.html')
    }),
    new HtmlWebpackplugin({
      template: '!!ejs-compiled-loader!' + path.join(ROOT_PATH, '../src/server-template.ejs'),
      filename: 'server.ejs'
    }),
    new webpack.DefinePlugin({ // webpack去区分打包的模块文件是开发的bundle 还是生产的bundle
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor' // vendor不再打包到 home.js 里面
      // filename: 'js/[name].[hash].js'
      // minChunks: Infinity
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest', // webpack 公共逻辑
      minChunks: Infinity

    }),

    new BabelEnginePlugin({
      presets: [
        'env'
      ]
    }),
    new NameAllModulesPlugin(),
    new webpack.NamedChunksPlugin((chunk) => {
      if (chunk.name) { // 替换 chunkID 改成 name, 文件 长缓存
        return chunk.name
      }
      return chunk.mapModules(m => path.relative(m.context, m.request)).join('_')
    }),
    new webpack.NamedModulesPlugin() // 一部模块变更不影响其他异步模块
    // new ExtractTextWbpackPlugin({
    //   filename: 'css/[name].[chunkhash].css'
    // }),
    // 结合 ExtractTextWbpackPlugin 使用 必须写在它后面 ，去除用不到的plugin
    // new PurifyCssWebpack({
    //   paths: glob.sync(path.join(__dirname, '.index.html'))
    // })

    // new HtmlInlineChunkPlugin({ // 直接 script标签 插入 manifest 的内容
    //   inlineChunks: ['manifest']
    // })
    // js shaking 没用到的 冗余的代卖去除。
  ]
}

module.exports = isEnv === 'development' ? devConf : prodConf
