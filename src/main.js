// import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

// import ElementUI from 'element-ui'
// import 'vant/lib/index.css'
import '@vant/touch-emulator'
// import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import utc from 'dayjs/plugin/utc'

dayjs.locale('zh-cn')
dayjs.extend(utc)

Vue.filter('prettyDate', dateString => {
  const date = dayjs
    .utc(dateString)
    .local()
    .format('YYYY年MM月DD日 HH:mm:ss')
  return date
})

Vue.filter('simplePrettyDate', dateString => {
  const date = dayjs
    .utc(dateString)
    .local()
    .format('YYYY年MM月DD日')
  return date
})

import { getToken } from '@/utils/auth'
import axios from 'axios'
const noToken = ['/auth/signin']
axios.interceptors.request.use((config) => {
  if (!noToken.includes(config.url.substring(0, 25))) {
    // if (config.method !== 'POST') {
    //   config.data = true
    // }
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
    config.headers['Authorization'] = `Bearer ${getToken()}`
  }
  return config
})

axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:8090/api'
Vue.prototype.$axios = axios
Vue.prototype.$baseURL = 'https://tokisaki-admin-1257494597.cos.ap-shanghai.myqcloud.com'
// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.use(VueQuillEditor)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
