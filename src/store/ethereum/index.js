import Web3 from 'web3'
import localStorage from '../../lib/local-storage'
import contracts from './contracts'
import Wallet from '../../lib/dgnx-wallet'
// import getWalletBalance from '../../lib/get-wallet-balance'

const defaultState = {
  web3: null,
  isLoadingWeb3: false,
  isLoadingWallet: false,
  isLoadingWalletBalance: false,
  wallet: null,
  walletBalance: '',
  walletAddress: '',
  walletPublicKey: '',
}

export default {
  namespaced: true,
  modules: {
    contracts,
  },
  state: {
    ...defaultState,
  },
  mutations: {
    SET_LOADING_WEB3(state, isLoadingWeb3) {
      state.isLoadingWeb3 = isLoadingWeb3
    },
    SET_LOADING_WALLET(state, isLoadingWallet) {
      state.isLoadingWallet = isLoadingWallet
    },
    SET_LOADING_WALLET_BALANCE(state, isLoadingWalletBalance) {
      state.isLoadingWalletBalance = isLoadingWalletBalance
    },
    SET_WEB3(state, web3Instance) {
      state.web3 = web3Instance
    },
    SET_IMPORT_PRIVATE_KEY_INPUT(state, privateKey) {
      state.importPrivateKeyInput = privateKey
    },
    SET_WALLET(state, wallet) {
      state.wallet = wallet
    },
    SET_WALLET_BALANCE(state, balance) {
      state.walletBalance = balance
    },
    SET_WALLET_PUBLIC_KEY(state, publicKey) {
      state.walletPublicKey = publicKey
    },
    SET_WALLET_ADDRESS(state, walletAddress) {
      state.walletAddress = walletAddress
    },
    CLEAR_WALLET(state) {
      state.wallet = null
      state.walletBalance = ''
      state.walletAddress = ''
      state.walletPublicKey = ''
    },
  },
  actions: {
    async initWeb3({ commit }, rpcUrl) {
      try {
        commit('SET_WEB3', null)
        commit('SET_LOADING_WEB3', true)

        const web3 = new Web3()
        web3.setProvider(new Web3.providers.HttpProvider(rpcUrl))
        const isConnected = await web3.eth.net.isListening()
        if (isConnected) {
          console.log(isConnected)
          commit('SET_WEB3', web3)
        }

        commit('SET_LOADING_WEB3', false)
        return { success: true }
      } catch (error) {
        console.log(error)
        
        commit('SET_WEB3', null)
        commit('SET_LOADING_WEB3', false)
        return { success: false, error }
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
    async generateWalletFromMnemonic({ commit }) {
      try {
        commit('SET_LOADING_WALLET', true)

        commit('CLEAR_WALLET')

        // // Convert mnemonic to seed buffer
        // const seedBuffer = await bip39.mnemonicToSeed(mnemonic)
        // // HD Key
        // const HDKey = hdkey.fromMasterSeed(seedBuffer)
        // // Derivation path
        // const derivationPath = "m/44'/60'/0'/0/"

        // // For now only create 1 account which is the 0th account in terms of derivation path
        // const walletHDPath = derivationPath + '0' 
        // const hdWallet = HDKey.derivePath(walletHDPath).getWallet()

        // // Create keystore and store it in localStorage
        // const keystore = Wallet.encrypt(hdWallet.getPrivateKeyString(), password)
        // const keystoreStr = JSON.stringify(keystore)
        // localStorage.setKeystore(keystoreStr)

        // const wallet = Wallet.fromPrivateKey(hdWallet.getPrivateKeyString())
        
        // wallet.balance = await getWalletBalance(state.web3, wallet.address)
        
        // commit('SET_WALLET_PUBLIC_KEY', wallet.getPublicKeyString())
        // commit('SET_WALLET_ADDRESS', wallet.getAddressString())

        // commit('SET_WALLET', wallet) // FIXME: simpen untuk dev

        // commit('SET_LOADING_WALLET', false)
      } catch (err) {
        console.log(err)
        commit('CLEAR_WALLET')
        commit('SET_LOADING_WALLET', false)

        throw new Error(err)
      }
    },
    async generateWalletFromPrivateKey({ commit }, { privateKey, password }) {
      try {
        // state
        commit('SET_LOADING_WALLET', true)
        commit('CLEAR_WALLET')

        // Create keystore and store it in localStorage
        const keystore = Wallet.encrypt(privateKey, password)
        const keystoreStr = JSON.stringify(keystore)
        localStorage.setKeystore(keystoreStr)

        const wallet = Wallet.fromPrivateKey(privateKey)

        // wallet.balance = await getWalletBalance(state.web3, wallet.address)

        commit('SET_WALLET_PUBLIC_KEY', wallet.getPublicKeyString())
        commit('SET_WALLET_ADDRESS', wallet.getAddressString())

        commit('SET_WALLET', wallet) // FIXME: simpen untuk dev

        commit('SET_LOADING_WALLET', false)
      } catch (err) {
        console.log(err)
        commit('CLEAR_WALLET')
        commit('SET_LOADING_WALLET', false)

        throw new Error(err)
      }
    },
    async decryptKeystore({ commit }, { keystore, password }) {
      try {
        commit('SET_LOADING_WALLET', true)
        commit('CLEAR_WALLET')

        const wallet = Wallet.decrypt(keystore, password)
        localStorage.setKeystore(JSON.stringify(keystore))

        commit('SET_WALLET_PUBLIC_KEY', wallet.getPublicKeyString())
        commit('SET_WALLET_ADDRESS', wallet.getAddressString())

        commit('SET_WALLET', wallet) // FIXME: simpen untuk dev
        commit('SET_LOADING_WALLET', false)

        return { success: true }

      } catch (err) {
        console.log(err)
        commit('CLEAR_WALLET')

        commit('SET_LOADING_WALLET', false)
        return { success: false, error: err.message }
      }
    },
  },
  getters: {
    getWeb3(state) {
      return state.web3
    },
    getWalletAddress(state) {
      return state.walletAddress
    },
    getWalletPublicKey(state) {
      return state.walletPublicKey
    },
    getWalletPrivateKey(state) {
      return state.wallet
        ? state.wallet.getPrivateKeyString()
        : ''
    },
    getWalletBalance(state) {
      return state.walletBalance
    }
  }
}
