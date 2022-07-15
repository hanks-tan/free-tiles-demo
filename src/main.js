import Vue from 'vue'
import App from './App.vue'
import 'ol/ol.css'
import './assets/css/iconfont.css'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
