import localStorage from "./local-storage"

const defaultConfig = {
  gasPrice: "100000",
  gasLimit: "10000000"
}

class AppConfig {
  constructor() {
    localStorage.setAppConfig(JSON.stringify({
      gasPrice: defaultConfig.gasPrice,
      gasLimit: defaultConfig.gasLimit
    }))
  }

  getCurrentAppConfig() {
    const configJson = localStorage.getAppConfig()
    return JSON.parse(configJson)
  }

  getGasPrice() {
    const currentConfig = this.getCurrentAppConfig()
    if (currentConfig) {
      return currentConfig.gasPrice
    }
    return defaultConfig.gasPrice
  }

  setGasPrice(gasPrice) {
    const currConfig = this.getCurrentAppConfig()

    localStorage.setAppConfig(JSON.stringify({ ...currConfig, gasPrice }))
  }

  getGasLimit() {
    const currentConfig = this.getCurrentAppConfig()
    if (currentConfig) {
      return currentConfig.gasLimit
    }
    return defaultConfig.gasLimit
  }

  setGasLimit(gasLimit) {
    const currConfig = this.getCurrentAppConfig()

    localStorage.setAppConfig(JSON.stringify({ ...currConfig, gasLimit }))
  }
}

export default new AppConfig()
