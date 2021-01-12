import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import { fmtSpecimenNumber } from './lib/string-format'
import { format, fromUnixTime } from 'date-fns'


Vue.config.productionTip = false

Vue.filter('specimenNumber', function(val) {
  return fmtSpecimenNumber(val)
})
Vue.filter('timestampToDate', function(val) {
  try {
    return format(fromUnixTime(val), 'MMMM dd yyyy')
  } catch (err) {
    console.log(err)
    return ''
  }
})

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
