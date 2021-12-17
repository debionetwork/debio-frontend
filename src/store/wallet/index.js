import apiClientRequest from "@/lib/api";

const defaultState = {
  resultMsg: null,
}

export default {
  namespaced: true,
  state: { ...defaultState },
  mutations: {
    SET_RESULT(state, resultMsg) {
      state.resultMsg = resultMsg
    },
  },
  actions: {
    async walletBinding({commit}, payload) {
      try {
        const debioApiKey = process.env.VUE_APP_DEBIO_API_KEY
        const { data } = await apiClientRequest.post("/substrate/wallet-binding", payload , {
          headers: { "debio-api-key" : debioApiKey },
          auth: {
            username: process.env.VUE_APP_USERNAME,
            password: process.env.VUE_APP_PASSWORD
          }
        })

        commit('SET_RESULT', data)
      } catch (e) {
        console.error(e)
      }
    }
  },
}
