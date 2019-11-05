import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import marked from 'marked'
import { withStyles } from 'material-ui/styles'
import { inject, observer } from 'mobx-react'
import formatDate from 'dateformat'
import { LinearProgress } from 'material-ui/Progress'
import Button from 'material-ui/Button'
import Paper from 'material-ui/Paper'
import IconReply from '@material-ui/icons/Reply'
import SimpleMDE from '../../components/simple-mde/index'
import Container from '../layout/container'
import Reply from './reply'
// import Marked from '../components/marked'
import { topicDetailStyle } from './styles'

const withStores = (component) => {
  return inject(stores => ({
    appState: stores.appState,
    topicStore: stores.topicStore,
  }))(observer(component))
}

class TopicDetail extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }
  constructor() {
    super()
    this.state = {
      newReply: '',
    }
    this.handleNewReplyChange = this.handleNewReplyChange.bind(this)
    this.gotoLogin = this.gotoLogin.bind(this)
    this.getTopic = this.getTopic.bind(this)
    this.getId = this.getId.bind(this)
    this.postReply = this.postReply.bind(this)
  }

  componentDidMount() {
    const id = this.getId()
    this.props.topicStore.getTopicDetail(id)
  }
  getTopic() {
    // 获取列表 其中一项的 详情
    const id = this.getId()
    return this.props.topicStore.detailMap[id]
  }
  getId() {
    return this.props.match.params.id
  }
  handleNewReplyChange(value) {
    this.setState({
      newReply: value,
    })
  }
  gotoLogin() {
    this.context.router.history.push('/user/login')
  }

  postReply() { // 把 handleNewReplyChang（）的内容发送到服务端
    const topic = this.getTopic() // 获取列表其中一项的详情
    topic.doReply(this.state.newReply) // topic 是Topic class的实例，继承 doReply方法
      .then(() => {
        this.setState({ // post 成功之后， 清空编辑器的内容
          newReply: '',
        })
      }).catch((err) => {
        console.log(err)
      })
  }
  render() {
    const topic = this.getTopic()
    const classes = this.props.classes
    const syncing = this.props.topicStore.syncing
    const { user } = this.props.appState
    if (!topic) {
      return (
        <Container>
          <Helmet>
            <title> 123 </title>
          </Helmet>
          {
            syncing ?
              (
                <LinearProgress color="secondary" />
              )
              : null
          }
        </Container>
      )
    }
    return (
      <Container>
        <Helmet>
          <title>{topic.title}</title>
        </Helmet>
        <header className={classes.header}>
          <h3>{topic.title}</h3>
        </header>
        {
          syncing ?
            (
              <LinearProgress color="secondary" />
            )
            : null
        }
        <section className={classes.body}>
          <div className={classes.markedStyle} dangerouslySetInnerHTML={{ __html: marked(topic.content) }} />
        </section>
        {/* 展示 我 新进来的 回复 */}
        {
          topic.createdReplies && topic.createdReplies.length > 0 ?
          (
            <Paper
              elevation={4}
              className={classes.replies}
            >
              <header className={classes.replyHeader}>
                <span>我的最新回复</span>
                <span>{`${topic.createdReplies.length}条`}</span>
              </header>
              {/* 显示我回复的具体数据 */}
              {
                topic.createdReplies.map(reply => (
                  <Reply
                    key={reply.id}
                    reply={Object.assign({}, reply, {
                      author: {
                        avatar_url: user.info.avatar_url,
                        loginname: user.info.loginname,
                      },
                    })}
                  />
                ))
              }
            </Paper>
          )
          : null
        }
        <Paper elevation={4} className={classes.replies}>
          {/* 编辑器上 显示 回复数量，与最新 回复时间 */}
          <header className={classes.replyHeader}>
            <span>{`${topic.reply_count} 回复`}</span>
            <span>{`最新回复 ${formatDate(topic.last_reply_at, 'yy年m月dd日')}`}</span>
          </header>
          {/* 如果登陆 显示 编辑器 */}
          {
            user.isLogin ?
              <section className={classes.replyEditor}>
                <SimpleMDE
                  onChange={this.handleNewReplyChange}
                  value={this.state.newReply}
                  options={{
                    toolbar: false,
                    autoFocus: false,
                    spellChecker: false,
                    placeholder: '回复',
                  }}
                />
                <Button color="primary" onClick={this.postReply}>
                  <IconReply />
                </Button>
              </section> : null
            }
          {/* 如果没有登陆 显示 登陆按钮 */}
          {
               !user.isLogin &&
               <section className={classes.notLoginButton}>
                 <Button color="primary" onClick={this.gotoLogin}>登陆/回复</Button>
               </section>
            }
          {/* 话题 回复的内容 */}
          <section>
            {
              topic.replies.map(reply => <Reply reply={reply} key={reply.id} />)
            }
          </section>
        </Paper>
      </Container>
    )
  }
}


TopicDetail.propTypes = {
  topicStore: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
}
export default withStyles(topicDetailStyle)(withStores(TopicDetail))

