import Vue from 'vue'
import Vuex from 'vuex'
import ethereum from './ethereum'
import testRequest from './testRequest'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
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

