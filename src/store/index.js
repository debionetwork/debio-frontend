import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import ethereum from './ethereum'
import metamask from './metamask'
import testRequest from './testRequest'
import substrate from './substrate'
import lab from './lab'
import feedback from './feedback'
import registration from './registration'
import wallet from './wallet'

Vue.use(Vuex)
Vue.config.devtools = true

export default new Vuex.Store({
  modules: {
    auth,
    ethereum,
    metamask,
    testRequest,
    substrate,
    lab,
    feedback,
    registration,
    wallet
  },
  state: {
  },
  mutations: {
  },
  actions: {
  },
  getters: {},
})
