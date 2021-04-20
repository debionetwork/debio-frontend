const localStorage = {
  /**
   * Keys
   */
  DEGENICS_KS: 'DEGENICS_KS',
  DEGENICS_RPC_URL: 'DEGENICS_RPC_URL',
  DEGENICS_CONFIG: 'DEGENICS_CONFIG',
  DEGENICS_ADDRESS_LOGIN: 'DEGENICS_ADDRESS_LOGIN',
  /**
   * getter setters
   */
  setKeystore(keystore) {
    window.localStorage.setItem(this.DEGENICS_KS, keystore)
  },
  getKeystore() {
    return window.localStorage.getItem(this.DEGENICS_KS) 
  },
  removeKeystore() {
    window.localStorage.removeItem(this.DEGENICS_KS)
  },
  setRpcUrl(url) {
    window.localStorage.setItem(this.DEGENICS_RPC_URL, url)
  },
  getRpcUrl() {
    return window.localStorage.getItem(this.DEGENICS_RPC_URL)
  },
  setAppConfig(jsonConfig) {
    window.localStorage.setItem(this.DEGENICS_CONFIG, jsonConfig)
  },
  getAppConfig() {
    return window.localStorage.getItem(this.DEGENICS_CONFIG)
  },
  clear() {
    //window.localStorage.removeItem(this.DEGENICS_KS)
    window.localStorage.removeItem(this.DEGENICS_ADDRESS_LOGIN)
    window.localStorage.removeItem(this.DEGENICS_RPC_URL)
    window.localStorage.removeItem(this.DEGENICS_CONFIG)
  },
  setAddress(address) {
    window.localStorage.setItem(this.DEGENICS_ADDRESS_LOGIN, address)
  },
  getAddress() {
    return window.localStorage.getItem(this.DEGENICS_ADDRESS_LOGIN) 
  },
  removeAddress() {
    window.localStorage.removeItem(this.DEGENICS_ADDRESS_LOGIN)
  },
}

export default localStorage

