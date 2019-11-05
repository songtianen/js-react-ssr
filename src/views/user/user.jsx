import React from 'react'
import PropTypes from 'prop-types'
import {
  inject,
  observer,
} from 'mobx-react'

import Avatar from 'material-ui/Avatar'
import { withStyles } from 'material-ui/styles'

import UserIcon from '@material-ui/icons/AccountCircle'

import Container from '../layout/container'
import userStyles from './styles/user-style'

const withStores = (component) => {
  return inject(stores => ({
    user: stores.appState.user,
  }))(observer(component))
}

class User extends React.Component {
  constructor() {
    super()
    this.state = {
      name: '未登录',
    }
  }

  render() {
    const classes = this.props.classes
    const user = this.props.user.info || {}
    //  || {}
    return (
      <Container>
        <div className={classes.avatar}>
          <div className={classes.bg} />
          {
            user.avatar_url ?
              <Avatar className={classes.avatarImg} src={user.avatar_url} /> :
              <Avatar className={classes.avatarImg}>
                <UserIcon />
              </Avatar>
          }
          <span className={classes.userName}>{user.loginname || this.state.name}</span>
        </div>
        {this.props.children}
      </Container>
    )
  }
}

User.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,

}

export default withStyles(userStyles)(withStores(User))
