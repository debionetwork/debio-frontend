import Vue from 'vue'
import Vuex from 'vuex'
import ethereum from './ethereum'
import requestForm from './requestForm'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    ethereum,
    requestForm,
  },
  state: {
  },
  mutations: {
  },
  actions: {
  },
  getters: {},
})

