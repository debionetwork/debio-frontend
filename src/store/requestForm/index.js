
const defaultState = {
  lab: {
    country: '',
    city: '',
    id: '',
    name: '',
    walletAddress: '',
  },
  isLoading: false,
  countries: [],
  cities: [],
  labs: [],
  products: [],
}

export default {
  namespaced: true,
  state: { ...defaultState },
  mutations: {
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading
    },
    SET_LAB(state, lab) {
      state.lab = lab
    },
    SET_PRODUCTS(state, products) {
      state.products = products
    },
    SET_COUNTRIES(state, countries) {
      state.countries = countries
    },
    SET_CITIES(state, cities) {
      state.cities = cities
    },
    SET_LABS(state, labs) {
      state.labs = labs
    }
  },
  actions: {
    async getLabs({ commit, rootGetters }) {
      try {
        commit('SET_LOADING', true)
        // TODO: Get labs from degenicsContract
        const degenicsContract = rootGetters['ethereum/contracts/getDegenicsContract']
        console.log(degenicsContract)

        const labCount = await degenicsContract.methods.labCount().call()

        const promises = []
        for (let i = 0; i < labCount; i++) {
          const promise = degenicsContract.methods.labByIndex(i).call()
          promises.push(promise)
        }
        const labs = await Promise.all(promises)

        commit('SET_LABS', labs)
        commit('SET_LOADING', false)

      } catch (err) {
        console.log(err)
        commit('SET_LABS', [])
        commit('SET_LOADING', false)
      }

    }
  },
}
