import localStorage from '../lib/local-storage'
import router from '../router'

const globalFunctions = {
  hasStatusLogin() {
    const keystore = localStorage.getAddress()
    return !!keystore
  },
  async checkIsLoggedIn() {
    const isLoggedIn = this.hasStatusLogin();
    const address = localStorage.getAddress();
    if (!isLoggedIn && window.location.pathname != '/login') {
      router.push('/login')
      return ""
    }

    if (isLoggedIn && window.location.pathname == '/login') {
      router.push('/')
      return address;
    }

    // is logged in, continue
    router.push(window.location.pathname)
    return address
  }
}

export default globalFunctions
