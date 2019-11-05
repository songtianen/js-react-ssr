// 专门处理跟话题有关的数据
import {
  // configure,
  observable,
  action,
  computed,
  decorate,
  extendObservable,
  toJS
} from 'mobx'
import { topicSchema, replySchema } from './variable-define'
import { get, post } from '../src/util/http'

// configure({ enforceActions: true })

const createTopic = (topic) => {
  return Object.assign({}, topicSchema, topic) // 新值，默认值，定义的值（传进来的值）
}
const createReaplies = (reply) => {
  return Object.assign({}, replySchema, reply)
}
class Topic {
  syncing
  createdReplies // 创建一个我的 回复 的数组
  constructor(data) {
    extendObservable(this, data) // 全部设置成为 可观察的 对象
    this.syncing = false
    this.createdReplies = []
  }

  doReply(content) { // 发送回复
    return new Promise((resolve, reject) => {
      post(`/topic/${this.id}/replies`, {
        needAccessToken: true
      }, {content}).then((resp) => {
        if (resp.success) { // 回复成功 返回
          this.createdReplies.push(createReaplies({
            id: resp.reply_id, // 服务端返回的id
            content, // 自己回复的内容
            create_at: Date.now() // 创建的时间
          }))
          resolve(resp)
        } else {
          reject(resp)
        }
      }).catch(reject)
    })
  }
}

decorate(Topic, {
  createdReplies: observable,
  syncing: observable,
  doReply: action
})

class TopicStore {
  tab
  topics
  details
  syncing
  createdTopics = [] //  新建的话题
  constructor({ tab = null, syncing = false, topics = [], details = [] } = {}) {
    this.tab = tab
    this.syncing = syncing
    this.topics = topics.map(topic => new Topic(createTopic(topic))) // 里面的每一项都是 topic的实例，里面继承类 topic方法
    this.details = details.map(topic => new Topic(createTopic(topic)))
  }

  get detailMap() { // 计算值： detail 转换成对象
    return this.details.reduce((result, detail) => {
      result[detail.id] = detail
      return result
    }, {})
  }
  addTopic(topic) {
    this.topics.push(new Topic(createTopic(topic)))
  }
  pushDetails(topic) {
    this.details.push(topic)
  }

  changeSyncing() {
    this.syncing = !this.syncing
  }
  // 获取列表页
  fetchTopics(tab) {
    return new Promise((resolve, reject) => {
      if (tab === this.tab && this.topics.length > 0) {
        resolve() // 如果请求已经发送，就不再发送请求
      } else {
        this.tab = tab
        this.topics = []
        this.changeSyncing() // 开始的状态
        get('/topics', {
          mdrender: false,
          tab: tab
        }).then(resp => {
          if (resp.success) { // 如果有topic数据 ，就 push 到 这个类的的topic变量里面去
            const topics = resp.data.map((el) => {
              return new Topic(createTopic(el)) // 弄成可观察状态
            })
            this.topics = topics
            resolve(resp)
            this.changeSyncing()
          }
        }).catch(
          (err) => {
            this.changeSyncing()
            reject(err)
          })
      }
    })
  }
  // 获取列表详情页
  getTopicDetail(id) {
    return new Promise((resolve, reject) => {
      this.changeSyncing()// 开始的状态
      if (this.detailMap[id]) {
        resolve(this.detailMap[id])
        this.changeSyncing()
      } else {
        get(`/topic/${id}`, {
          mdrender: false
        }).then(resp => {
          if (resp.success) {
            const topic = new Topic(createTopic(resp.data))
            this.pushDetails(topic)
            resolve(resp)
            this.changeSyncing()
          }
        }).catch(
          (err) => {
            this.changeSyncing()
            reject(err)
          })
      }
    })
  }
  // 创建 话题（title，content）
  createTopic(title, tab, content) {
    return new Promise((resolve, reject) => {
      post(`/topics`, {
        needAccessToken: true
      }, {
        title, tab, content
      }).then((resp) => {
        if (resp.success) {
          const topic = {
            title,
            tab,
            content,
            id: resp.topic_id,
            create_at: Date.now()
          }
          this.createdTopics.push(new Topic(createTopic(topic)))
          resolve(resp)
        }
        reject(resp.data)
      }).catch(reject)
    })
  }

  toJson() {
    return {
      topics: toJS(this.topics),
      syncing: this.syncing,
      details: toJS(this.details),
      tab: this.tab
    }
  }
}

decorate(TopicStore, {
  createdTopics: observable,
  syncing: observable,
  topics: observable,
  details: observable,
  detailMap: computed,
  fetchTopics: action,
  getTopicDetail: action,
  pushDetails: action,
  changeSyncing: action,
  createTopic: action,
  addTopic: action
})

export default TopicStore
