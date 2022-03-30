const ERC20Interface = require("./abi/ERC20Interface.json")

const defaultState = {
  contractERC20Interface: null
}

export default {
  namespaced: true,
  state: {
    ...defaultState
  },
  mutations: {
    SET_CONTRACT_ERC20Interface(state, contractERC20Interface) {
      state.contractERC20Interface = contractERC20Interface
    }
  },
  actions: {
    initContracts({ commit, rootState }) {
      const { web3 } = rootState.metamask
      let ERC20InterfaceContract;
      let contractAddress = process.env.VUE_APP_DEBIO_DAI_TOKEN_ADDRESS;
      ERC20InterfaceContract = new web3.eth.Contract(ERC20Interface, contractAddress);

      commit("SET_CONTRACT_ERC20Interface", ERC20InterfaceContract)
    }
  },
  getters: {
    getERC20InterfaceContract(state) {
      return state.contractERC20Interface
    }
  }
}
