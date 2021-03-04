import { connect as connectSubstrate } from '@/lib/substrate'

const defaultState = {
  api: null,
  isLoadingApi: false,
  wallet: null,
  walletBalance: null,
}

export default {
  namespaced: true,
  state: {
    ...defaultState
  },
  mutations: {
    SET_API(state, api) {
      state.api = api
    },
    SET_LOADING_API(state, isLoading) {
      state.isLoadingApi = isLoading
    },
    SET_WALLET(state, wallet) {
      state.wallet = wallet
    },
    CLEAR_WALLET(state) {
      state.wallet = null
      state.walletBalance = null
    },
    SET_WALLET_BALANCE(state, balance) {
      state.walletBalance = balance
      console.log(state.walletBalance)
    }
  },
  actions: {
    async connect({ commit }) {
      try {
        commit('SET_LOADING_API', true)
        const api = await connectSubstrate()
        await api.isReady
        console.log(api)
        commit('SET_API', api)

        commit('SET_LOADING_API', false)
      } catch (err) {
        console.log(err)
        commit('SET_LOADING_API', false)
      }
    }
  },
  getters: {
    wallet(state) {
      return state.wallet
    }
  }
}

