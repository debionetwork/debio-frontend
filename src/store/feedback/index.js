import axios from 'axios'
const baseUrl = process.env.VUE_APP_BACKEND_API

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
      const result = await axios.post(`${baseUrl}/rating`, data)
      if (result) {
        console.log(result)
      }
    }
  },
  getters: {
  }
}
