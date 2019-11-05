import React from 'react'
import PropTypes from 'prop-types'

import { Route, Redirect, withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import TopicList from '../views/topic-list'
import TopciDetail from '../views/topic-detail/index'
import UserLogin from '../views/user/login'
import UserInfo from '../views/user/info'
import TopicCreate from '../views/topic-create/index'

// 需要登陆的页面，要登陆才能查看
const PrivateRoute = ({ isLogin, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={
      props => (
        isLogin ?
          <Component {...props} />
          : <Redirect
            to={{
                pathname: '/user/login',
                // search: `?from=${rest.path}`,
                state: {
                  from: rest.path,
                  // referrer: props.location,
                         },
               }}
          />
      )
    }
  />
)


const PrivateRouteWithStore = withRouter(inject(stores => ({ // eslint-disable-line
  isLogin: stores.appState.user.isLogin,
}))(observer(PrivateRoute)))

PrivateRoute.propTypes = {
  isLogin: PropTypes.bool,
  location: PropTypes.object.isRequired,
  component: PropTypes.element.isRequired,
}
// PrivateRoute.defaultProps = {
//   isLogin: false,
// }
export default () => [
  // 默认路由设置在c路由页面上面
  <Route key="default" path="/" render={() => <Redirect to="/index" />} exact />,
  <Route key="Topicindex" path="/index" component={TopicList} />,
  <Route key="TopciDetail" path="/detail/:id" component={TopciDetail} />,
  <Route key="UserLogin" path="/user/login" component={UserLogin} />,
  <PrivateRouteWithStore key="UserInfo" exact path="/user/info" component={UserInfo} />,
  <PrivateRouteWithStore key="TopicCreate" path="/topic/create" component={TopicCreate} />,
]
