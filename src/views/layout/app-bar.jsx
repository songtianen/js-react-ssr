import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import Typography from 'material-ui/Typography'
import { appBarStyles } from './styles'

const withStores = (component) => {
  return inject(stores => ({
    appState: stores.appState,
  }))(observer(component))
}


class MainAppbar extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }
  constructor() {
    super()
    this.state = {
    }
    this.homeIconOnClick = this.homeIconOnClick.bind(this)
    this.createButtonClick = this.createButtonClick.bind(this)
    this.loginButtonClick = this.loginButtonClick.bind(this)
  }

  /* eslint-disable*/
  homeIconOnClick() {
    this.context.router.history.push('/index?tab=all')
  }
  createButtonClick() {
    this.context.router.history.push('/topic/create')
  }
  loginButtonClick() {
    if (this.props.appState.user.isLogin) {
      this.context.router.history.push('/user/info')
    } else {
      this.context.router.history.push('/user/login')
    }
  }
  /* eslint-enable */
  render() {
    const { classes } = this.props
    const { user } = this.props.appState
    return (
      <div className={classes.width}>
        <AppBar>
          <Toolbar>
            <IconButton color="secondary" onClick={this.homeIconOnClick}>
              <HomeIcon />
            </IconButton>
            <Typography variant="headline" className={classes.flex} color="inherit">
              JavaScript
            </Typography>
            <Button color="inherit" onClick={this.createButtonClick}>新建话题</Button>
            <Button color="inherit" onClick={this.loginButtonClick}>
              {
                user.isLogin ? user.info.loginname : '登陆'
              }
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}
MainAppbar.propTypes = {
  classes: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired,
}
export default withStyles(appBarStyles)(withStores(MainAppbar))
