import Web3 from 'web3'

const RPC_URL = 'http://localhost:8545'

const defaultState = {
  instance: null,
  isLoading: false,
}

export default {
  namespaced: true,
  state: {
    ...defaultState,
  },
  mutations: {
    SET_INSTANCE(state, web3Instance) {
      state.instance = web3Instance
    },
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading
    }
  },
  actions: {
    async initWeb3({ commit }) {
      try {
        commit('SET_INSTANCE', null)
        commit('SET_LOADING', true)

        const web3 = new Web3()
        web3.setProvider(new Web3.providers.HttpProvider(RPC_URL))
        const isConnected = await web3.eth.net.isListening()
        if (isConnected) {
          commit('SET_INSTANCE', web3)
        }

        commit('SET_LOADING', false)
      } catch (err) {
        console.log(err)
        
        commit('SET_INSTANCE', null)
        commit('SET_LOADING', false)
      }
    }
  },
  getters: {

  }
}
