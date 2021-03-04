const localStorage = {
  /**
   * Keys
   */
  DEGENICS_KS: 'DEGENICS_KS',
  DEGENICS_RPC_URL: 'DEGENICS_RPC_URL',
  DEGENICS_CONFIG: 'DEGENICS_CONFIG',
  DEBIO_WALLET: 'DEBIO_WALLET',
  /**
   * getter setters
   */
  setWallet(wallet) {
    window.localStorage.setItem(this.DEBIO_WALLET, wallet)
  },
  getWallet() {
    return window.localStorage.getItem(this.DEBIO_WALLET)
  },
  clearWallet() {
    window.localStorage.removeItem(this.DEBIO_WALLET)
  },
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
    window.localStorage.removeItem(this.DEGENICS_KS)
    window.localStorage.removeItem(this.DEGENICS_RPC_URL)
    window.localStorage.removeItem(this.DEGENICS_CONFIG)
    window.localStorage.removeItem(this.DEBIO_WALLET)
  }
}

export default localStorage

