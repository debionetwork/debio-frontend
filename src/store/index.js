import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import ethereum from './ethereum'
import testRequest from './testRequest'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    ethereum,
    testRequest,
  },
  state: {
  },
  mutations: {
  },
  actions: {
  },
  getters: {},
})

