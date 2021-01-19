import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import { fmtSpecimenNumber } from './lib/string-format'
import { format, fromUnixTime } from 'date-fns'
import localStorage from './lib/local-storage'


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

/**
 * setupAppDependencies
 *
 * Wait for web3 and smart contracts to load
 * this will set web3 and smart contracts to store
 */
async function setupAppDependencies() {
  const LOCAL_RPC_URL = 'http://34.101.243.127:8545'
  let rpcUrl = localStorage.getRpcUrl() || LOCAL_RPC_URL
  await store.dispatch('ethereum/initWeb3', rpcUrl)
  store.dispatch('ethereum/contracts/initContracts')
  return
}

setupAppDependencies()
  .then(() => {

    new Vue({
      vuetify,
      router,
      store,
      render: h => h(App)
    }).$mount('#app')

  })
