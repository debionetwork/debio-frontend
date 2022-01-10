const Degenics = require('./abi/Degenics.json')
const DegenicsLog = require('./abi/DegenicsLog.json')
const Location = require('./abi/Location.json')
const Lab = require('./abi/Lab.json')
const Account = require('./abi/Account.json')
const Specimen = require('./abi/Specimen.json')

const defaultState = {
  contractDegenics: null,
  contractDegenicsLog: null,
  contractLocation: null,
  contractLab: null,
  contractAccount: null,
  contractSpecimen: null,
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
    SET_CONTRACT_DEGENICS_LOG(state, contractDegenicsLog) {
      state.contractDegenicsLog = contractDegenicsLog
    },
    SET_CONTRACT_LOCATION(state, contractLocation){
      state.contractLocation = contractLocation
    },
    SET_CONTRACT_LAB(state, contractLab){
      state.contractLab = contractLab
    },
    SET_CONTRACT_ACCOUNT(state, contractAccount){
      state.contractAccount = contractAccount
    },
    SET_CONTRACT_SPECIMEN(state, contractSpecimen){
      state.contractSpecimen = contractSpecimen 
    }
  },
  actions: {
    initContracts({ commit, rootState }) {
      const { web3 } = rootState.ethereum
      const degenicsContract =  new web3.eth.Contract(Degenics, process.env.VUE_APP_DEBIO_ETH_DEGENICS_ADDRESS)
      const degenicsLogContract = new web3.eth.Contract(DegenicsLog, process.env.VUE_APP_DEBIO_ETH_DEGENICS_LOG_ADDRESS) // TO REMOVE ?
      const locationContract =  new web3.eth.Contract(Location, process.env.VUE_APP_DEBIO_ETH_LOCATION_ADDRESS)
      const labContract =  new web3.eth.Contract(Lab, process.env.VUE_APP_DEBIO_ETH_LAB_ADDRESS) // TO REMOVE ?
      const accountContract =  new web3.eth.Contract(Account, process.env.VUE_APP_DEBIO_ETH_ACCOUNT_ADDRESS) // TO REMOVE ?
      const specimenContract =  new web3.eth.Contract(Specimen, process.env.VUE_APP_DEBIO_ETH_SPECIMEN_ADDRESS) // TO REMOVE ?


      commit('SET_CONTRACT_DEGENICS', degenicsContract)
      commit('SET_CONTRACT_DEGENICS_LOG', degenicsLogContract)
      commit('SET_CONTRACT_LOCATION', locationContract)
      commit('SET_CONTRACT_LAB', labContract)
      commit('SET_CONTRACT_ACCOUNT', accountContract)
      commit('SET_CONTRACT_SPECIMEN', specimenContract)
    }
  },
  getters: {
    getDegenicsContract(state){
      return state.contractDegenics
    },
    getDegenicsLogContract(state) {
      return state.contractDegenicsLog
    },
    getLocationContract(state){
      return state.contractLocation
    },
    getLabContract(state){
      return state.contractLab
    },
    getAccountContract(state) {
      return state.contractAccount
    }
  }
}
