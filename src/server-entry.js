import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { Provider, useStaticRendering } from 'mobx-react'
// 服务端渲染
import { JssProvider } from 'react-jss'
import { MuiThemeProvider } from 'material-ui/styles'
import Home from './views/home'
import { createStoreMap } from '../store/store'

useStaticRendering(true) // mobx 服务端渲染的工具
// 参数服务端传入
export default (stores, routerContext, sheets, generateClassName, theme, url) => (
  <Provider {...stores}>
    <StaticRouter context={routerContext} location={url}>
      <JssProvider registry={sheets} generateClassName={generateClassName}>
        <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
          <Home />
        </MuiThemeProvider>
      </JssProvider>
    </StaticRouter>
  </Provider>
)

export { createStoreMap } // 服务端渲染的时候用
