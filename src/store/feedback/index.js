import apiClientRequest from "@/lib/api"

const defaultState = {
  feedback: {
    rate: "",
    comment: ""
  }
}

export default {
  namespaced: true,
  state: { 
    ...defaultState 
  },
  mutations: {
    SET_FEEDBACK(state, data) {
      state.feedback = data
    },
  },
  actions: {
    async sendFeedback({commit}, feedback) {
      commit('SET_FEEDBACK', feedback)

      const data = {
        "labId": feedback.labId,
        "serviceId": feedback.serviceId,
        "orderId": feedback.orderId,
        "rating_by": feedback.customerId,
        "rating": feedback.rate,
        "created": feedback.createdAt
      }

      await apiClientRequest.post("/rating", data, {
        auth: {
          username: process.env.VUE_APP_USERNAME,
          password: process.env.VUE_APP_PASSWORD
        }
      })
    }
  },
  getters: {
  }
}
