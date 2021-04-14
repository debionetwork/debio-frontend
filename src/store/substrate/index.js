import keyring from '@polkadot/ui-keyring';
import { ApiPromise, WsProvider } from '@polkadot/api'
import types from './types.json'
import localStorage from '@/lib/local-storage'
// u8aToString, stringToU8a
import { u8aToHex } from '@polkadot/util'

const {
  mnemonicToMiniSecret,
  naclKeypairFromSeed,
  cryptoWaitReady,
} = require('@polkadot/util-crypto');

cryptoWaitReady().then(() => {
  keyring.loadAll({ ss58Format: 42, type: 'ed25519' });
});

const defaultState = {
  api: null,
  isLoadingApi: false,
  isLoadingWallet: false,
  wallet: null,
  walletBalance: null,
  walletAddress: '',
  walletPublicKey: '',
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
    SET_LOADING_WALLET(state, isLoadingWallet) {
      state.isLoadingWallet = isLoadingWallet
    },
    SET_WALLET_BALANCE(state, balance) {
      state.walletBalance = balance
      console.log(state.walletBalance)
    },
    SET_WALLET_PUBLIC_KEY(state, publicKey) {
      state.walletPublicKey = publicKey
    },
    SET_WALLET_ADDRESS(state, walletAddress) {
      state.walletAddress = walletAddress
    },

    CLEAR_WALLET(state) {
      state.wallet = null
      state.walletBalance = null
    }
  },
  actions: {
    async connect({ commit }) {
      try {
        commit('SET_LOADING_API', true)
        const PROVIDER_SOCKET = 'wss://debio.theapps.dev/node'
        const wsProvider = new WsProvider(PROVIDER_SOCKET)
        const api = await ApiPromise.create({
          provider: wsProvider,
          types: types
        })
        await api.isReady
        console.log(api)
        commit('SET_API', api)

        commit('SET_LOADING_API', false)
      } catch (err) {
        console.log(err)
        commit('SET_LOADING_API', false)
      }
    },
    async registerMnemonic({ commit }, { mnemonic, password }) {
      try {
        commit('SET_LOADING_WALLET', true)
        commit('CLEAR_WALLET')

        const { pair, json } = keyring.addUri(mnemonic, password, { name: 'mnemonic acc' })
        localStorage.setKeystore(JSON.stringify(json))
        commit('SET_WALLET_PUBLIC_KEY', u8aToHex(pair.publicKey))
        commit('SET_WALLET_ADDRESS', pair.address)
        commit('SET_WALLET', pair) // FIXME: simpen untuk dev
        commit('SET_LOADING_WALLET', false)
       
        const seed = mnemonicToMiniSecret(mnemonic)
        const { publicKey, secretKey } = naclKeypairFromSeed(seed)
        console.log(u8aToHex(publicKey))
        console.log(u8aToHex(secretKey))

        return { success: true }
      } catch (err) {
        console.log(err)
        commit('CLEAR_WALLET')
        commit('SET_LOADING_WALLET', false)
        return { success: false, error: err.message }
      }
    },
    async restoreAccountKeystore({ commit }, { file, password }) {
      try {
        commit('SET_LOADING_WALLET', true)
        const pair = keyring.restoreAccount(file, password);
        localStorage.setKeystore(JSON.stringify(file))
        commit('SET_WALLET_PUBLIC_KEY', u8aToHex(pair.publicKey))
        commit('SET_WALLET_ADDRESS', pair.address)
        commit('SET_WALLET', pair) // FIXME: simpen untuk dev
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
    wallet(state) {
      return state.wallet
    },
    getAPI(state) {
      return state.api
    }
  }
}

