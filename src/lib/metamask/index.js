import store from '../../store'
import detectEthereumProvider from '@metamask/detect-provider'

export async function handleAccountsChanged(accounts, currentAccount) {
  if (accounts.length === 0) {
    throw 'Please connect to MetaMask.'
  } else if (accounts[0] !== currentAccount) {
    return accounts[0]
  }
}

export async function handleChainChanged(newChainId) {
  console.log(newChainId)
  // Recommended to reload the page, unless you must do otherwise
  window.location.reload();
}

export async function connectToMetamask() {
  try {
    let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    let currentAccount = await handleAccountsChanged(accounts, null)

    window.ethereum.on('accountsChanged', (accounts) => {
      handleAccountsChanged(accounts, null)
    })
    window.ethereum.on('chainChanged', handleChainChanged)

    return { currentAccount: currentAccount, accountList: accounts }
  }
  catch (err) {
    if (err.code === 4001) {
      throw 'Please connect to MetaMask.'
    }
    throw err
  }
}

export async function startApp() {
  try {
    const provider = await detectEthereumProvider()

    if (provider) {
      if (provider !== window.ethereum) {
        throw 'Do you have multiple wallets installed?'
      }
      return connectToMetamask()
    } else {
      console.log("Please install MetaMask!");
      return { currentAccount: "no_install" };
    }
  } catch (e) {
    console.log("Connection refush.");
    window.refresh();
  }
}

export async function getTransactionReceiptMined(txHash, interval) {
  const web3 = store.getters['metamask/getWeb3']
  const self = this

  const transactionReceiptAsync = function(resolve, reject) {
    web3.eth.getTransactionReceipt(txHash, (error, receipt) => {
      if (error) {
        reject(error)
      } else if (receipt == null) {
        setTimeout(
          () => transactionReceiptAsync(resolve, reject),
          interval ? interval : 500
        )
      } else {
        resolve(receipt)
      }
    })
  }

  if (Array.isArray(txHash)) {
    return Promise.all(txHash.map(txh => self.getTransactionReceiptMined(txh, interval)))
  } else if (typeof txHash === "string") {
    return new Promise(transactionReceiptAsync)
  } else {
    throw new Error("Invalid Type: " + txHash)
  }
}