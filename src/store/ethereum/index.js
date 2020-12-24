import Web3 from 'web3'
import * as bip39 from 'bip39'
import { hdkey } from 'ethereumjs-wallet'

const RPC_URL = 'http://localhost:8545'

const defaultState = {
  web3: null,
  isLoading: false,
  mnemonic: '',
  wallet: null,
}

export default {
  namespaced: true,
  state: {
    ...defaultState,
  },
  mutations: {
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading
    },
    SET_WEB3(state, web3Instance) {
      state.web3 = web3Instance
    },
    SET_MNEMONIC(state, mnemonic) {
      state.mnemonic = mnemonic
    },
    SET_WALLET(state, wallet) {
      state.wallet = wallet
    }
  },
  actions: {
    async initWeb3({ commit }) {
      try {
        commit('SET_WEB3', null)
        commit('SET_LOADING', true)

        const web3 = new Web3()
        web3.setProvider(new Web3.providers.HttpProvider(RPC_URL))
        const isConnected = await web3.eth.net.isListening()
        if (isConnected) {
          commit('SET_WEB3', web3)
        }

        commit('SET_LOADING', false)
      } catch (err) {
        console.log(err)
        
        commit('SET_WEB3', null)
        commit('SET_LOADING', false)
      }
    },
    /*
     * generateWallet
     *
     * sets wallet to state.ethereum.wallet
     *
     * Reference:
     * https://github.com/ethereum/web3.js/issues/1594
     *
     * Steps:
     * 1. Generate private key by using:
     *   - mnemonics
     *   - hd Key
     *   - derivation path
     * 2. use web3 to create the account from the private key
     *   web3.eth.accounts.privateKeyToAccount(privateKey)
     */
    async generateWallet({ commit, state }) {
      // Convert mnemonic to seed buffer
      const seedBuffer = await bip39.mnemonicToSeed(state.mnemonic)
      // HD Key
      const HDKey = hdkey.fromMasterSeed(seedBuffer)
      // Derivation path
      const derivationPath = "m/44'/60'/0'/0/"

      // For now only create 1 account which is the 0th account in terms of derivation path
      const walletHDPath = derivationPath + '0' 
      const wallet = HDKey.derivePath(walletHDPath).getWallet()

      commit('SET_WALLET', wallet)
      /*
       * How to access wallet address and private key
       */
      // const address = wallet.getAddress().toString('hex')
      // const privateKey = wallet.getPrivateKey().toString('hex')
    },
    generateMnemonic({ commit }) {
      const mnemonic = bip39.generateMnemonic()
      commit('SET_MNEMONIC', mnemonic)
    }
  },
  getters: {
    getMnemonicArray(state) {
      return state.mnemonic.split(' ')
    },
    getWalletAddress(state) {
      return state.wallet
        ? '0x' + state.wallet.getAddress().toString('hex')
        : 'Account not set'
    },
    getWalletPubKey(state) {
      return state.wallet
        ? state.wallet.getPublicKeyString()
        : 'Wallet not set'
    }
  }
}
