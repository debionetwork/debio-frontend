import detectEthereumProvider from '@metamask/detect-provider'

export async function handleAccountsChanged(accounts, currentAccount){
    if (accounts.length === 0) {
        throw 'Please connect to MetaMask.'
    } else if (accounts[0] !== currentAccount) {
        return accounts[0]
    }
}

export async function handleChainChanged(newChainId){
    console.log(newChainId)
    // Recommended to reload the page, unless you must do otherwise
    window.location.reload();
}

export async function connectToMetamask() {
    try{
        let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        let currentAccount = await handleAccountsChanged(accounts, null)

        window.ethereum.on('accountsChanged', (accounts) => {
            handleAccountsChanged(accounts, null)
        })
        window.ethereum.on('chainChanged', handleChainChanged)

        return { currentAccount: currentAccount, accountList: accounts }
    }
    catch(err){
        if (err.code === 4001) {
          throw 'Please connect to MetaMask.'
        }
        throw err
    }
}

export async function startApp(){
    const provider = await detectEthereumProvider()

    if (provider) {
        if (provider !== window.ethereum) {
            throw 'Do you have multiple wallets installed?'
        }
        return connectToMetamask()
    } 
    
    else {
      throw 'Please install MetaMask!'
    }
}