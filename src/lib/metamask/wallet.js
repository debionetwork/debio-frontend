export async function getBalance(address) {
    let balance = await window.ethereum.request({ 
        method: 'eth_getBalance',
        params: [
            address,
            'latest'
        ]
    })
    return parseInt(balance, 16) 
}

export async function changeChain(){
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x97',
          chainName: 'Smart Chain Testnet',
          nativeCurrency:
          {
            name: 'BNB',
            symbol: 'BNB',
            decimals: 18
          },
          rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
          blockExplorerUrls: ['https://testnet.bscscan.com'],
        }
        // {
        //     chainId: '0x3',
        //     chainName: 'Ethereum Testnet',
        //     nativeCurrency: {
        //     name: 'Ethereum',
        //     symbol: 'ETH',
        //     decimals: 18,
        //     },
        //     rpcUrls: [
        //         'https://ropsten.infura.io/v3/undefined'
        //     ],
        //     blockExplorerUrls: [
        //         'https://ropsten.etherscan.io'
        //     ],
        // }
      ],
    });
}

export async function addToken(){
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // The address that the token is at.
          symbol: 'USDT', // A ticker symbol or shorthand, up to 5 chars.
          decimals: 18, // The number of decimals in the token
          image: 'https://s2.coinmarketcap.com/static/img/coins/200x200/825.png', // A string url of the token logo
        },
      },
    })
  
    if (!wasAdded) {
      throw 'Failed to add USDT token!'
    }
}