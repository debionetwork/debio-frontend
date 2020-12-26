const localStorage = {
  /**
   * Keys
   */
  DEGENICS_KS: 'DEGENICS_KS',
  /**
   * getter setters
   */
  setKeyStore(keyStore) {
    window.localStorage.setItem(this.DEGENICS_KS, keyStore)
  },
  getKeyStore() {
    return window.localStorage.getItem(this.DEGENICS_KS) 
  },
  clear() {
    window.localStorage.removeItem(this.DEGENICS_KS)
  }
}

export default localStorage

