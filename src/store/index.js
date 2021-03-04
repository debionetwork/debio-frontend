import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import ethereum from './ethereum'
import testRequest from './testRequest'
import substrate from './substrate'

Vue.use(Vuex)
Vue.config.devtools = true

export default new Vuex.Store({
  modules: {
    auth,
    ethereum,
    testRequest,
    substrate
  },
  state: {
  },
  mutations: {
  },
  actions: {
  },
  getters: {},
})

