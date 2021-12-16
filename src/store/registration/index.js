import apiClientRequest from "@/lib/api"

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
    async registration({commit}, payload) {
      const { data } = await apiClientRequest.post("/substrate/get-dbio-pre-register", payload)

      commit('SET_RESULT', data)
    }
  },
  getters: {
  }
}
