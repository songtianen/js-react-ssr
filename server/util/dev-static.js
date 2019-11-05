const path = require('path')
const MemoryFs = require('memory-fs') // 写入内存的工具
const axios = require('axios')// 读取内存的文件
const proxy = require('http-proxy-middleware')
const webpack = require('webpack') // 启动webpack.config.server.js，得到打包的结果，来获取 server-entry.js的结果
const serverConfig = require('../../pack/webpack.config.server') // 导入webpack配置
const serverRender = require('./server-render')

const getTemplate = () => { // 读取内存中的 index.html
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/server.ejs')
      .then((res) => {
        resolve(res.data)
      }, () => reject())
  }).catch(err => console.log(err))
}

// ------------------------------------------
const NativeModule = require('module')
const vm = require('vm')

const getModuleFromString = (bundle, filename) => {
  const m = { exports: {} }
  const wrapper = NativeModule.wrap(bundle)
  const script = new vm.Script(wrapper, {
    filename,
    displayErrors: true,
  })
  const result = script.runInThisContext()
  result.call(m.exports, m.exports, require, m)
  return m
}
// ------------------------------------------
let serverBundle
const serverCompiler = webpack(serverConfig)
const mfs = new MemoryFs() // 实例化一个memoryFs
serverCompiler.outputFileSystem = mfs
serverCompiler.watch({}, (err, stats) => { // 重点！监听webpack打包server-entry的一个过程
  if (err) console.log(err)
  stats = stats.toJson()
  stats.errors.forEach(er => console.log(er))
  stats.warnings.forEach(er => console.log(er))
  const serverEntryPath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename,
  )
  const serverEntryBundle = mfs.readFileSync(serverEntryPath, 'utf-8') // 得到的是 编译后的 字符串内容
  const m = getModuleFromString(serverEntryBundle, 'server-entry.js') // Module 模块转化 serverRntryBundle字符串，成为module模块
  serverBundle = m.exports
})
// ------------------------------------------
module.exports = (app) => {
  // 把静态文件全部代理到 这个服务上面
  app.use('/public', proxy({
    target: 'http://localhost:8888',
  }))
  app.get('*', (req, res, next) => {
    if (!serverBundle) {
      return res.send(' refresh later')
    }
    getTemplate().then((template) => {
      return serverRender(serverBundle, template, req, res) // 服务端渲染的逻辑
    }).catch(next)
  })
}
