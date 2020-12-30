import Vue from 'vue'
import Vuex from 'vuex'
import ethereum from './ethereum'
import cart from './cart'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    ethereum,
    cart,
  },
  state: {
  },
  mutations: {
  },
  actions: {
  },
  getters: {},
})

