import localStorage from '../local-storage'

const defaultConfig = {
  gasPrice: '100000',
  gasLimit: '10000000'
}

class AppConfig {
  constructor() {
    let config = localStorage.getAppConfig()
    if (!config) {
      localStorage.setAppConfig(JSON.stringify({
        gasPrice: defaultConfig.gasPrice,
        gasLimit: defaultConfig.gasLimit
      }))
    }
  }

  getCurrentAppConfig() {
    const configJson = localStorage.getAppConfig()
    return JSON.parse(configJson)
  }

  getGasPrice() {
    return this.getCurrentAppConfig().gasPrice
  }

  setGasPrice(gasPrice) {
    const currConfig = this.getCurrentAppConfig()

    localStorage.setAppConfig(JSON.stringify({ ...currConfig, gasPrice }))
  }

  getGasLimit() {
    return this.getCurrentAppConfig().gasLimit
  }

  setGasLimit(gasLimit) {
    const currConfig = this.getCurrentAppConfig()

    localStorage.setAppConfig(JSON.stringify({ ...currConfig, gasLimit }))
  }
}

export default new AppConfig()
