import store from '../store'
import privateKeyToPublicKey from 'ethereum-private-key-to-public-key'

/**
 * Wallet is web3 wallet with extended methods and properties
 * */
class Wallet {
  /**
   * Do not create wallet from constructor directly.
   * Instead, use static methods
   *
   * @param {Object} web3Wallet -> wallet created using web3
   * */
  constructor(web3Wallet) {
    for (let [key, val] of Object.entries(web3Wallet)) {
      this[key] = val
    }
    this.publicKey = privateKeyToPublicKey(this.privateKey).toString('hex')
  }

  getPrivateKeyString() {
    return this.privateKey
  }

  getPublicKeyString() {
    return '0x' + this.publicKey
  }

  getAddressString() {
    return this.address
  }

  /**
   * @returns {Wallet} wallet instance
   * */
  static fromPrivateKey(privateKey) {
    const web3 = store.getters['ethereum/getWeb3']
    try {
      const _privateKey = privateKey.startsWith('0x') ? privateKey : '0x' + privateKey
      const wallet = web3.eth.accounts.privateKeyToAccount(_privateKey)
      return new Wallet(wallet)

    } catch (err) {
      throw new Error('dgnx-wallet Error on fromPrivateKey: ' + err.message)
    }
  }

  /**
   * @returns {Object} keystore
   * */
  static encrypt(privateKey, password) {
    const web3 = store.getters['ethereum/getWeb3']

    try {
      const keystore = web3.eth.accounts.encrypt(privateKey, password)
      return keystore

    } catch (err) {
      throw new Error('dgnx-wallet Error on encrypt: ' + err.message)
    }
  }

  /**
   * @returns {Wallet} wallet instance
   * */
  static decrypt(keystore, password) {
    const web3 = store.getters['ethereum/getWeb3']

    let _keystore = keystore
    if (typeof keystore != 'string') {
      _keystore = JSON.stringify(keystore)
    }

    try {
      const wallet = web3.eth.accounts.decrypt(_keystore, password)

      return new Wallet(wallet)

    } catch (err) {
      throw new Error('dgnx-wallet Error on decrypt: ' + err.message)
    }
    
  }
}

export default Wallet
