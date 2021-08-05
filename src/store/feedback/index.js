const defaultState = {
  feedback: {}
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
    }
  },
  getters: {
  }
}
