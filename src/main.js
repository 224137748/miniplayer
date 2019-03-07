import Vue from 'vue'
import App from './App'
import 'common/stylus/index.styl'
import store from './store'
import * as Fly from './api/fly'
Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$http = Fly
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
