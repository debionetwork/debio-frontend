import axios from 'axios'
const baseUrl = process.env.VUE_APP_BACKEND_API

const defaultState = {
  result: null
}

export default {
  namespaced: true,
  state: { 
    ...defaultState 
  },
  mutations: {
    SET_RESULT(state, data) {
      state.result = data
    },
  },
  actions: {
    async registration({commit}, data) {
      const result = await axios.post(`${baseUrl}/substrate/get-dbio-pre-register`, data)
      commit('SET_RESULT', result.data)
      console.log("result", result.data)
    }
  },
  getters: {
  }
}
