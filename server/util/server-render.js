const bootstrapper = require('react-async-bootstrapper') // 服务端渲染 前端异步数据
const ejs = require('ejs')
const serializeJS = require('serialize-javascript')
const { Helmet } = require('react-helmet') // 渲染 SEO 头部标签
const ReactDomServer = require('react-dom/server')
// css in js 服务端
const SheetsRegistry = require('react-jss').SheetsRegistry
// const create = require('jss').create
// const preset = require('jss-preset-default').default
const createGenerateClassName = require('material-ui/styles/createGenerateClassName').default
const createMuiTheme = require('material-ui/styles').createMuiTheme
const teal = require('material-ui/colors/teal').default // 颜色
const amber = require('material-ui/colors/amber').default


const getStoreState = (stores) => { //  找到toJson方法 返回的数据：浏览器 和 服务端的数据 不同步
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson()
    return result
  }, {}) // 提取成一个新数组
}

// 服务端渲染的逻辑
module.exports = (bundle, template, req, res) => {
  return new Promise((resolve, reject) => {
    const createStoreMap = bundle.createStoreMap
    const createApp = bundle.default
    const routerContext = {} // server-entry 路由的配置
    const Stores = createStoreMap() // 客户端的 stores数据
    const user = req.session.user

    if (user) { // 如果session有user，就把客户端 user 设置成 session 的user
      Stores.appState.user.isLogin = true
      Stores.appState.user.info = user
      console.log('==========', Stores.appState.user)
    }
    // css in js ----------------
    const theme = createMuiTheme({
      palette: {
        primary: amber,
        secondary: teal,
        type: 'dark',
      },
    })
    const sheetsRegistry = new SheetsRegistry()
    // const jss = create(preset())
    // jss.options.createGenerateClassName = createGenerateClassName
    const generateClassName = createGenerateClassName()
    // css in js ----------------
    const appcontent = createApp(Stores, routerContext, sheetsRegistry, generateClassName, theme, req.url)
    bootstrapper(appcontent).then(() => { // 客户端的异步数据：同样的方法写在前端某组建内
      if (routerContext.url) { // 路由跳转：如果有react-router给出的属性url，就直接在服务端redirect 掉
        res.status(302).setHeader('Location', routerContext.url) // 如果客户端，有路由跳转，直接在服务端 redercet 掉
        res.end()
        return // eslint-disable-line
      }
      const states = getStoreState(Stores) // 想办法把这部分数据插入到html中去
      console.log('::::::::::', states)

      const content = ReactDomServer.renderToString(appcontent)
      const helmet = Helmet.renderStatic() // 这个方法写在ReactDomServer.renderToString之后
      const html = ejs.render(template, { // 把客户端的 state 挂载到window 全局对象中，以便于客户端获取，插入到 ejs模版中
        appString: content, // 得到服务端渲染的内容
        initialState: serializeJS(states), // ejs 中的变量,serializeJ(把字符串转成string)
        meta: helmet.meta.toString(), // SEO 的一些标签
        title: helmet.title.toString(),
        style: helmet.style.toString(),
        link: helmet.link.toString(),
        materialCss: sheetsRegistry.toString(), // ejs css变量
      })
      res.send(html)
      resolve()
    }).catch(reject)
  })
}
