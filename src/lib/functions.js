import localStorage from '../lib/local-storage'
import router from '../router'

const globalFunctions = {
  hasKeystore() {
    const keystore = localStorage.getKeystore()
    return !!keystore
  },
  checkIsLoggedIn() {
    const isLoggedIn = this.hasKeystore()
    if (!isLoggedIn && router.currentRoute.fullPath != '/login') {
      router.push('/login')
      return
    }
    
    if (isLoggedIn && router.currentRoute.fullPath == '/login') {
      router.push('/')
      return
    }
    // is logged in, continue
    router.push(router.currentRoute.fullPath)
  }
}

export default globalFunctions
