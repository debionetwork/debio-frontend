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
    if (!isLoggedIn && router.currentRoute.fullPath != '/login') {
      router.push('/login')
      return ""
    }

    if (isLoggedIn && router.currentRoute.fullPath == '/login') {
      router.push('/')
      return address;
    }

    // is logged in, continue
    router.push(router.currentRoute.fullPath)
    return address
  }
}

export default globalFunctions
