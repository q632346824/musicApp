import Vue from 'vue'
import App from './App.vue'
import fastclick from 'fastclick'
import router from './router'
import VueLazyload from 'vue-lazyload'
 



import '@/assets/stylus/index.styl'

Vue.config.productionTip = false
// fastclick是禁止跳转的
fastclick.attach(document.body)

Vue.use(VueLazyload, {
  loading: require('./assets/image/default.png'),
})


new Vue({
  render: h => h(App),
  router
}).$mount('#app')
