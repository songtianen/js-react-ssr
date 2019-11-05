import React from 'react'
import PropTypes from 'prop-types'
import {
  inject,
  observer,
} from 'mobx-react'

import TextField from 'material-ui/TextField'
import Radio from 'material-ui/Radio'
import Button from 'material-ui/Button'
import IconReply from '@material-ui/icons/Reply'
import { withStyles } from 'material-ui/styles'
import Snackbar from 'material-ui/Snackbar'
// import SimpleMDE from '../../components/simple-mde/index'
import SimpleMDE from 'react-simplemde-editor'
import Container from '../layout/container'
import { tabs } from '../../../store/variable-define'
import createStyles from './styles'


const withStores = (component) => {
  return inject(stores => ({
    appState: stores.appState,
    topicStore: stores.topicStore,
  }))(observer(component))
}

class TopicCreate extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super()
    this.state = {
      // showEditor: false,
      message: '',
      title: '',
      content: '',
      tab: 'dev',
      open: false,
    }
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleContentChange = this.handleContentChange.bind(this)
    this.handleChangeTab = this.handleChangeTab.bind(this)
    this.handleCreate = this.handleCreate.bind(this)
    this.handleSnackClose = this.handleSnackClose.bind(this)
  }

  handleTitleChange(e) {
    this.setState({
      title: e.target.value.trim(),
    })
  }

  handleContentChange(value) {
    this.setState({
      content: value,
    })
  }

  handleChangeTab(e) {
    this.setState({
      tab: e.currentTarget.value,
    })
  }
  handleSnackClose() {
    this.setState({
      open: false,
    })
  }
  showMessage(message) {
    this.setState({
      open: true,
      message,
    })
  }
  handleCreate() {
    const {
      tab, title, content,
    } = this.state
    if (!title) {
      this.showMessage('title必须填写')
      return // return 防止 下一个判断 覆盖 这个判断
    }
    if (!content) {
      this.showMessage('内容必须填写')
      return
    }
    console.log(tab, title, content)
    this.props.topicStore.createTopic(title, tab, content)
      .then(() => {
        this.context.router.history.push('/index')
      }).catch((err) => {
        this.showMessage(err.message)
      })
  }

  render() {
    const classes = this.props.classes
    const { message, open } = this.state
    return (
      <div>
        <Container>
          <Snackbar
            anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
            message={message}
            open={open}
            onClose={this.handleSnackClose}
          />
          <div className={classes.createRoot}>
            <TextField
              className={classes.title}
              label="标题"
              value={this.state.title}
              onChange={this.handleTitleChange}
              fullWidth
            />
            <SimpleMDE
              id="songtianen-1"
              onChange={this.handleContentChange}
              value={this.state.newReply}
              options={{
                // toolbar: false,
                spellChecker: false,
                placeholder: '发表你的精彩意见',
              }}
            />
            <div>
              {
                Object.keys(tabs).map((tab) => {
                if (tab !== 'all' && tab !== 'good') {
                  return (
                    <span className={classes.selectItem} key={tab}>
                      <Radio
                        value={tab}
                        checked={tab === this.state.tab}
                        onChange={this.handleChangeTab}
                      />
                      {tabs[tab]}
                    </span>
                  )
                }
                return null
              })
              }
            </div>
            <Button color="primary" onClick={this.handleCreate} className={classes.replyButton}>
              <IconReply />
            </Button>
          </div>
        </Container>
      </div>
    )
  }
}

TopicCreate.propTypes = {
  classes: PropTypes.object.isRequired,
  topicStore: PropTypes.object.isRequired,
}

export default withStyles(createStyles)(withStores(TopicCreate))
