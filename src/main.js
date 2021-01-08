import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import { fmtSpecimenNumber } from './lib/string-format'


Vue.config.productionTip = false

Vue.filter('specimenNumber', function(val) {
  return fmtSpecimenNumber(val)
})

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
