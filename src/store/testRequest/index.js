const defaultState = {
  lab: null,
  products: [],
}

export default {
  namespaced: true,
  state: { ...defaultState },
  mutations: {
    SET_LAB(state, lab) {
      state.lab = lab
    },
    SET_PRODUCTS(state, products) {
      state.products = products
    },
    CLEAR_TEST_REQUEST(state) {
      state.lab = null
      state.products = []
    },
  },
  actions: {
    async getLab({ commit }, lab) {
      commit('SET_LAB', lab)
    },
    async getProduct({ commit }, product) {
      commit('SET_PRODUCTS', product)
    },
  },
  getters: {
  }
}
