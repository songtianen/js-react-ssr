import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles' // 创建 material UI 主题 传入根组件 react上下文
import amber from 'material-ui/colors/amber'
import teal from 'material-ui/colors/teal';
import Home from './views/home'
import { AppState, TopicStore } from '../store/store'

// 创建主题
const theme = createMuiTheme({
  palette: {
    primary: amber,
    secondary: teal,
    type: 'dark',
  },
})
const createClientApp = (TheApp) => {
  class ClientApp extends React.Component {
    componentDidMount() {
      const jssStyles = document.getElementById('jss-server-side')
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles)
      }
    }
    render() {
      return <TheApp />
    }
  }

  return ClientApp
}
// 服务端的store数据
const initialState = window.__INITIAL__STATE__ || {} // eslint-disable-line
const appState = new AppState()
appState.init(initialState.appState)
console.log('initialState', initialState.appState)
console.log('topicStore', initialState.topicStore)

const topicStore = new TopicStore(initialState.topicStore)
const render = (Component) => { // eslint-disable-line
  const renderMenthod = !module.hot ? ReactDOM.hydrate : ReactDOM.render
  renderMenthod(
    <BrowserRouter>
      <Provider appState={appState} topicStore={topicStore} >
        <MuiThemeProvider theme={theme}>
          <Component />
        </MuiThemeProvider>
      </Provider>
    </BrowserRouter>,
    document.getElementById('root'),
  )
}
render(createClientApp(Home))

