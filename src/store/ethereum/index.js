import Web3 from 'web3'
import * as bip39 from 'bip39'
import Wallet, { hdkey } from 'ethereumjs-wallet'
import * as EthUtil from 'ethereumjs-util'
import localStorage from '../../lib/local-storage'


const RPC_URL = 'http://localhost:8545'

const defaultState = {
  web3: null,
  isLoading: false,
  wallet: null,
  walletAddress: '',
  walletPublicKey: '',
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
    SET_IMPORT_PRIVATE_KEY_INPUT(state, privateKey) {
      state.importPrivateKeyInput = privateKey
    },
    SET_WALLET(state, wallet) {
      state.wallet = wallet
    },
    SET_WALLET_PUBLIC_KEY(state, publicKey) {
      state.walletPublicKey = publicKey
    },
    SET_WALLET_ADDRESS(state, walletAddress) {
      state.walletAddress = walletAddress
    },
    CLEAR_WALLET(state) {
      state.wallet = null
      state.walletAddress = ''
      state.walletPublicKey = ''
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
    async generateWalletFromMnemonic({ commit }, { mnemonic, password }) {
      try {
        commit('SET_LOADING', true)

        commit('CLEAR_WALLET')

        // Convert mnemonic to seed buffer
        const seedBuffer = await bip39.mnemonicToSeed(mnemonic)
        // HD Key
        const HDKey = hdkey.fromMasterSeed(seedBuffer)
        // Derivation path
        const derivationPath = "m/44'/60'/0'/0/"

        // For now only create 1 account which is the 0th account in terms of derivation path
        const walletHDPath = derivationPath + '0' 
        const wallet = HDKey.derivePath(walletHDPath).getWallet()

        // Create keystore and store it in localStorage
        const keystoreStr = await wallet.toV3String(password)
        localStorage.setKeystore(keystoreStr)
        
        commit('SET_WALLET_PUBLIC_KEY', wallet.getPublicKeyString())
        commit('SET_WALLET_ADDRESS', wallet.getAddressString())

        commit('SET_WALLET', wallet) // FIXME: simpen untuk dev

        commit('SET_LOADING', false)
      } catch (err) {
        console.log(err)
        commit('CLEAR_WALLET')
        commit('SET_LOADING', false)
      }
    },
    async generateWalletFromPrivateKey({ commit }, { privateKey, password }) {
      try {
        commit('SET_LOADING', true)
        commit('CLEAR_WALLET')

        const privateKeyBuffer = EthUtil.toBuffer(privateKey)
        const wallet = Wallet.fromPrivateKey(privateKeyBuffer)

        // Create keystore and store it in localStorage
        const keystoreStr = await wallet.toV3String(password)
        localStorage.setKeystore(keystoreStr)

        commit('SET_WALLET_PUBLIC_KEY', wallet.getPublicKeyString())
        commit('SET_WALLET_ADDRESS', wallet.getAddressString())

        commit('SET_WALLET', wallet) // FIXME: simpen untuk dev

        commit('SET_LOADING', false)
      } catch (err) {
        console.log(err)
        commit('CLEAR_WALLET')
        commit('SET_LOADING', false)
      }
    },
    async decryptKeystore({ commit }, { keystore, password }) {
      try {
        commit('SET_LOADING', true)
        commit('CLEAR_WALLET')

        const wallet = await Wallet.fromV3(keystore, password)
        localStorage.setKeystore(JSON.stringify(keystore))

        commit('SET_WALLET_PUBLIC_KEY', wallet.getPublicKeyString())
        commit('SET_WALLET_ADDRESS', wallet.getAddressString())

        commit('SET_WALLET', wallet) // FIXME: simpen untuk dev
        commit('SET_LOADING', false)

        return { success: true }

      } catch (err) {
        console.log(err)
        commit('CLEAR_WALLET')

        commit('SET_LOADING', false)
        return { success: false, error: err.message }
      }
    }
  },
  getters: {
    getKeystore() {
      return localStorage.getKeystore()
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
    }
  }
}
