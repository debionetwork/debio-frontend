import localStorage from "./local-storage"

class Keystore {
  get() {
    try {
      return JSON.parse(localStorage.getKeystore())
    } catch (err) {
      return ""
    }
  }

  set(keystore) {
    const _keystore = JSON.stringify(keystore)
    localStorage.setKeystore(_keystore)
  }
}

export default new Keystore()
