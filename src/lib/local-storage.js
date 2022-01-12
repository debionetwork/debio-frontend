const localStorage = {
  /**
   * Keys
   */
  DEBIO_KS: 'DEBIO_KS',
  DEBIO_RPC_URL: 'DEBIO_RPC_URL',
  DEBIO_CONFIG: 'DEBIO_CONFIG',
  DEBIO_ADDRESS_LOGIN: 'DEBIO_ADDRESS_LOGIN',
  /**
   * getter setters
   */
  setKeystore(keystore) {
    window.localStorage.setItem(this.DEBIO_KS, keystore)
  },
  getKeystore() {
    return window.localStorage.getItem(this.DEBIO_KS)
  },
  removeKeystore() {
    window.localStorage.removeItem(this.DEBIO_KS)
  },
  setRpcUrl(url) {
    window.localStorage.setItem(this.DEBIO_RPC_URL, url)
  },
  getRpcUrl() {
    return window.localStorage.getItem(this.DEBIO_RPC_URL)
  },
  setAppConfig(jsonConfig) {
    window.localStorage.setItem(this.DEBIO_CONFIG, jsonConfig)
  },
  getAppConfig() {
    return window.localStorage.getItem(this.DEBIO_CONFIG)
  },
  clear() {
    // window.localStorage.removeItem(this.DEBIO_KS)
    window.localStorage.removeItem(this.DEBIO_ADDRESS_LOGIN)
    window.localStorage.removeItem(this.DEBIO_RPC_URL)
    window.localStorage.removeItem(this.DEBIO_CONFIG)
   // window.localStorage.removeItem("mnemonic_data")
  },
  setAddress(address) {
    window.localStorage.setItem(this.DEBIO_ADDRESS_LOGIN, address)
  },
  getAddress() {
    return window.localStorage.getItem(this.DEBIO_ADDRESS_LOGIN)
  },
  removeAddress() {
    window.localStorage.removeItem(this.DEBIO_ADDRESS_LOGIN)
  },
  setLocalStorageByName(name, data) {
    window.localStorage.setItem(name, data)
  },
  getLocalStorageByName(name) {
    return window.localStorage.getItem(name)
  },
  removeLocalStorageByName(name) {
    window.localStorage.removeItem(name)
  },
}

export default localStorage

