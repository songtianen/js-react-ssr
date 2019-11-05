import React from 'react'
import PropTypes from 'prop-types'
import {
  inject,
  observer,
} from 'mobx-react'
// import { Redirect } from 'react-router-dom'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import { withStyles } from 'material-ui/styles'

import UserWrapper from './user'
import loginStyles from './styles/login-style'

const withStores = (component) => {
  return inject(stores => ({
    appState: stores.appState,
  }))(observer(component))
}

class UserLogin extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super()
    this.state = {
      accesstoken: '',
      helpText: '',
    }
    this.handleLogin = this.handleLogin.bind(this)
    this.handleInput = this.handleInput.bind(this)
    // this.getFrom = this.getFrom.bind(this)
  }

  getFrom() {
    if (this.props.location.state) {
      const { from } = this.props.location.state
      return from
    }
    return '/user/info'
  }
  handleLogin() { // eslint-disable-line
    if (!this.state.accesstoken) {
      return this.setState({
        helpText: '必须填写',
      })
    }
    this.setState({
      helpText: '',
    })
    this.props.appState.login(this.state.accesstoken)
      .then(() => {
        if (this.props.location.state) {
          const { from } = this.props.location.state
          return this.context.router.history.replace(from)
        }
        return this.context.router.history.replace('/user/info')
      })
      .catch((err) => {
        console.log(err)
      })
  }

  handleInput(event) {
    this.setState({
      accesstoken: event.target.value.trim(),
    })
  }

  render() {
    const classes = this.props.classes
    // const from = this.getFrom()
    // console.log('......', from)
    // const isLogin = this.props.appState.user.isLogin
    // if (isLogin) { // 如果登陆了， 跳转到 原来的页面
    //   return <Redirect to={from} />
    // }
    return (
      <UserWrapper>
        <div className={classes.loginRoot}>
          <TextField
            label="请输入Cnode AccessToken"
            placeholder="请输入Cnode AccessToken"
            required
            helperText={this.state.helpText}
            value={this.state.accesstoken}
            onChange={this.handleInput}
            className={classes.input}
          />
          <Button
            color="primary"
            onClick={this.handleLogin}
            className={classes.loginButton}
          >
            登 录
          </Button>
        </div>
      </UserWrapper>
    )
  }
}

UserLogin.propTypes = {
  classes: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default withStyles(loginStyles)(withStores(UserLogin))
