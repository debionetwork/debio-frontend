import localStorage from '../../lib/local-storage'

const defaultState = {
  role: null,
}

export default {
  namespaced: true,
  state: {
    ...defaultState
  },
  mutations: {
    SET_ROLE(state, role) {
      state.role = role
    },
    CLEAR(state) {
      state.role = defaultState.role
    }
  },
  actions: {
    async getRole({ commit, rootGetters }) {
      try {
        let keystore = localStorage.getKeystore()
        keystore = JSON.parse(keystore)
        const accountContract = rootGetters['ethereum/contracts/getAccountContract']
        let role = await accountContract.methods.myRole().call({ from: keystore.address })
        if (role == '') {
          role = 'customer'
        }
        commit('SET_ROLE', role)

      } catch (err) {
        commit('SET_ROLE', null)
        throw new Error('Error on getting role from account Contract ', err.message)
      }
    },
    clearAuth({ commit }) {
      localStorage.removeKeystore()
      commit('CLEAR')
    }
  },
  getters: {
    getRole(state) {
      return state.role
    } 
  }
}
