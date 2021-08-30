import axios from 'axios'
const baseUrl = 'https://backend-dev.debio.network'

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
        "lab_id": feedback.lab_id,
        "service_id": feedback.service_id,
        "order_id": feedback.orderId,
        "rating_by": feedback.customer_id,
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
