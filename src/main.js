// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import  'echarts/theme/chalk.js'
import echarts from 'echarts'
import Axios from 'axios'
import  'echarts/theme/westeros.js'
import htmlToPdf from '@/components/utils/htmlToPdf'

import './style/theme.css'
import './style/characters.css'

//Vue.use(htmlToPdf)
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
Vue.prototype.$http = Axios

Vue.use(ElementUI)
Vue.prototype.$axios = Axios
Axios.defaults.baseURL = '/api'
Axios.defaults.headers.post['Content-Type'] = 'application/json';
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
