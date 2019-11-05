import { action, observable, decorate, toJS } from 'mobx'
import { post, get } from '../src/util/http'
// configure({ enforceActions: true })
//  configure({ isolatedGlobalState: true })
class AppStateClass {
  user = {
    isLogin: false,
    syncing: false,
    info: {},
    recent_topics: [],
    recent_replies: [],
    collections: []
  }

  login(accessToken) {
    return new Promise((resolve, reject) => {
      post('/user/login', {}, {
        accessToken
      }).then((resp) => {
        if (resp.success) {
          this.user.isLogin = true
          this.user.info = resp.data
          resolve(resp)
        }
      }).catch(err => reject(err))
    })
  }
  getUserDetail() {
    this.user.syncing = true
    return new Promise((resolve, reject) => {
      get('/user/' + this.user.info.loginname, {})
        .then((resp) => {
          if (resp.success) {
            this.user.recent_topics = resp.data.recent_topics
            this.user.recent_replies = resp.data.recent_replies
            resolve(resp)
          }
          this.user.syncing = false
        }).catch(
          (err) => {
            this.user.syncing = false
            reject(err)
          })
    })
  }
  getUserCollections() {
    return new Promise((resolve, reject) => {
      get('/topic_collect/' + this.user.info.loginname, {})
        .then((resp) => {
          if (resp.success) {
            this.user.collections = resp.data
            resolve(resp)
          }
        }).catch(
          (err) => {
            reject(err)
          })
    })
  }

  toJson() { // observable 对象转换成 js 对象，提供服务端使用
    return {
      user: toJS(this.user)
    }
  }
  init(appState) {
    if (!appState) {
      return this.user
    }
    if (appState.user) {
      this.user = appState.user
    }
  }
}

// configure({ isolateGlobalState: true })

decorate(AppStateClass, {
  user: observable,
  login: action,
  getUserDetail: action,
  getUserCollections: action
})

export default AppStateClass
