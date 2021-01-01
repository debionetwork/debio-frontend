const localStorage = {
  /**
   * Keys
   */
  DEGENICS_KS: 'DEGENICS_KS',
  DEGENICS_RPC_URL: 'DEGENICS_RPC_URL',
  /**
   * getter setters
   */
  setKeystore(keystore) {
    window.localStorage.setItem(this.DEGENICS_KS, keystore)
  },
  getKeystore() {
    return window.localStorage.getItem(this.DEGENICS_KS) 
  },
  setRpcUrl(url) {
    window.localStorage.setItem(this.DEGENICS_RPC_URL, url)
  },
  getRpcUrl() {
    return window.localStorage.getItem(this.DEGENICS_RPC_URL)
  },
  clear() {
    window.localStorage.removeItem(this.DEGENICS_KS)
  }
}

export default localStorage

