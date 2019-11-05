import React from 'react'
import { hot } from 'react-hot-loader'
import Routes from '../config/router'
import MainAppbar from './layout/app-bar'
// import TopicList from './topic-list/index'

class Home extends React.Component {
  componentDidMount() {
    // do some thing
  }
  render() {
    return (
      <div>
        <MainAppbar />
        <Routes />
      </div>
    )
  }
}
export default hot(module)(Home)
