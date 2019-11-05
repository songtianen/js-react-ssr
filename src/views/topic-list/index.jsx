import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { Helmet } from 'react-helmet'
import queryString from 'query-string'

import Tabs, { Tab } from 'material-ui/Tabs'
import List from 'material-ui/List'
import { LinearProgress } from 'material-ui/Progress'
import Container from '../layout/container'
import TopicListItem from './list-item'
import { tabs } from '../../../store/variable-define'

const withStores = (component) => {
  return inject(stores => ({
    appState: stores.appState,
    topicStore: stores.topicStore,
  }))(observer(component))
}

class TopicList extends React.Component {
  static contextTypes = { // 获取上下文对象中的 router对象，来获取
    router: PropTypes.object,
  }
  constructor(props) {
    super(props)
    this.TabHandleChange = this.TabHandleChange.bind(this)
    this.listItemClick = this.listItemClick.bind(this)
  }
  componentDidMount() {
    const tab = this.getTab()
    this.props.topicStore.fetchTopics(tab) // 获取对应标签下面的数据
    console.log('[][][][][][[]', this.props.appState.user)
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      this.props.topicStore.fetchTopics(this.getTab(nextProps.location.search))
    }
  }
  getTab(serach) { // 得到所选的 按键的 tab
    // 解析 URL 查询字符串 ？tab=xxx 的tab
    serach = serach || this.props.location.search
    const query = queryString.parse(serach)
    return query.tab || 'all'
  }

  bootstrap() {
    const query = queryString.parse(this.props.location.search)
    const tab = query.tab
    return this.props.topicStore.fetchTopics(tab || 'all').then(() => {
      console.log('>>>>>>>>>>>>>>>服务端成功')
      return true
    }).catch(() => {
      console.log('>>>>>>>>>>>>>>>服务端同步数据失败')
      return false
    })
  }

  TabHandleChange(e, value) { // 当切换按钮时 路由
    // 上下文对象 获取路由操作
    this.context.router.history.push({
      pathname: '/index',
      search: `?tab=${value}`,
    })
  }
  listItemClick(topic) { // 跳转到详情页
    this.context.router.history.push({
      pathname: `/detail/${topic.id}`,

    })
  }
  render() {
    const { topicStore } = this.props
    const syncing = topicStore.syncing
    const topicList = topicStore.topics
    const tab = this.getTab()
    return (
      <Container>
        <Helmet>
          <title> this is title</title>
          <meta name="内容" content="this is decr" />
        </Helmet>
        {
          syncing ?
            (
              <LinearProgress color="secondary" />
            )
            : null
        }
        <Tabs indicatorColor="primary" value={tab} onChange={this.TabHandleChange}>
          {
            Object.keys(tabs).map(el => (
              <Tab key={tabs[el]} label={tabs[el]} value={el} />
            ))
          }
        </Tabs>
        <List>
          {
          topicList.map(item => (
            <TopicListItem dense button key={item.id} onClick={() => this.listItemClick(item)} topic={item} />
          ))
          }
        </List>
      </Container>
    )
  }
}

TopicList.propTypes = {
  // 获取 react router 的location对象 拿到 url的
  // 查询字符串：localhost:8888/list?tab=xxx,来获取选中的tab
  // 所以要注入一个路由的 location地址
  location: PropTypes.object.isRequired,
  topicStore: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired,

}

export default withStores(TopicList)
