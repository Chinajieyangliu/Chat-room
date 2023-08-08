import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
// 导入websocket.io
import io from './components/weapp.socket.io/weapp.socket.io.js'
// 导入web
Vue.config.productionTip = false
// 请求后端地址
Vue.prototype.$http='http://localhost:3000'
Vue.prototype.socket = io('http://localhost:8082')
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif