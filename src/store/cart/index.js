
const defaultState = {
  lab: {
    country: '',
    city: '',
    id: '',
    name: '',
    walletAddress: '',
  },
  products: []
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
    }
  },
  actions: {},
}
