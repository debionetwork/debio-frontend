const contractInfo = require('./contract.json')

const Degenics = require('./Degenics.json').abi
const Location = require('./Location.json').abi
// const Lab = require('./Lab.json').abi

const defaultState = {
  contractDegenics: null,
  contractLocation: null,
  contractLab: null,
}

export default {
  namespaced: true,
  state: {
    ...defaultState,
  },
  mutations: {
    SET_CONTRACT_DEGENICS(state, contractDegenics){
      state.contractDegenics = contractDegenics
    },
    SET_CONTRACT_LOCATION(state, contractLocation){
      state.contractLocation = contractLocation
    },
    SET_CONTRACT_LAB(state, contractLab){
      state.contractLab = contractLab
    },
  },
  actions: {
    initContracts({ commit, rootState }) {
      const { web3 } = rootState.ethereum
      const degenicsContract =  new web3.eth.Contract(Degenics, contractInfo.Degenics.address)
      const locationContract =  new web3.eth.Contract(Location, contractInfo.Location.address)
      // const labContract =  new web3.eth.Contract(Lab, contractInfo.Lab.address)

      commit('SET_CONTRACT_DEGENICS', degenicsContract)
      commit('SET_CONTRACT_LOCATION', locationContract)
      // commit('SET_CONTRACT_LAB', labContract)
    }
  },
  getters: {
    getDegenicsContract(state){
      return state.degenicsContract
    },
    getLocationContract(state){
      return state.locationContract
    },
    // getLabContract(state){
      // return state.labContract
    // }
  }
}
