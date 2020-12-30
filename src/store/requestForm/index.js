
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
    async getRequestFormData({ commit, dispatch }) {
      try {
        commit('SET_LOADING', true)

        await dispatch('getCountries')
        await dispatch('getCities')
        await dispatch('getLabs')

        commit('SET_LOADING', false)
      } catch (err) {
        console.log(err)
        commit('SET_LOADING', false)
      }
    },
    async getCountries({ commit, rootGetters }) {
      try {
        const locationContract = rootGetters['ethereum/contracts/getLocationContract']
        const countryCount = await locationContract.methods.countCountry().call()

        const getCountryPromises = []
        for (let i = 1; i <= countryCount; i++) {
          getCountryPromises.push(
            locationContract.methods.countryByIndex(i).call()
          )
        }
        const countries = await Promise.all(getCountryPromises)

        commit('SET_COUNTRIES', countries)

      } catch (err) {
        console.log(err)

        commit('SET_COUNTRIES', [])
      }
    },
    async getCities({ commit, state, rootGetters }) {
      try {
        const { countries } = state
        const locationContract = rootGetters['ethereum/contracts/getLocationContract']

        const getCitiesPromises = []
        for (let country of countries) {
          const cityCount = await locationContract.methods.countCity(country) 
          for(let i = 1; i <= cityCount; i++) {
            const promise = locationContract.methods
              .cityByIndex(country, i).call()
              .then(city => ({ country, city }))

            getCitiesPromises.push(promise)
          }
        }

        const cities = await Promise.all(getCitiesPromises)

        commit('SET_CITIES', cities)

      } catch (err) {
        console.log(err)
        commit('SET_CITIES', [])
      }
    },
    async getLabs({ commit, state, rootGetters }) {
      try {
        const { cities } = state
        const degenicsContract = rootGetters['ethereum/contracts/getDegenicsContract']

        const getLabsPromises = []
        for (let cityObj of cities) {
          const { country, city } = cityObj
          const labCount = await degenicsContract.methods.labCount(country, city).call()

          for (let i = 0; i <= labCount; i++) {
            const promise = degenicsContract.methods
              .labByIndex(country, city, i).call()
              .then(res => {
                let {labAccount, name, country, city} = res
                return { labAccount, name, country, city }
              })
            
            getLabsPromises.push(promise)
          }
        }

        const labs = await Promise.all(getLabsPromises)

        commit('SET_LABS', labs)

      } catch (err) {
        console.log(err)
        commit('SET_LABS', [])
      }
    }
  },
  getters: {

  }
}
