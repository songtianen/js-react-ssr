import AppState from './app-state'
import TopicStore from './topic-store'
export { AppState, TopicStore }
export default {
  AppState: AppState,
  TopicStore: TopicStore
}
// 这个函数专门是给服务端渲染去用的
export const createStoreMap = () => {
  return {
    appState: new AppState(),
    topicStore: new TopicStore()
  }
}
