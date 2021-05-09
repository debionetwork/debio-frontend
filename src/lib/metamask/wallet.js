import abi from './usdt/abi.json'
import { usdtAddress } from './usdt'
import store from '../../store'

export async function getBalance(address) {
  const web3 = store.getters['ethereum/getWeb3']
  const tokenContract = new web3.eth.Contract(abi, usdtAddress())
  const balance = await tokenContract.methods
    .balanceOf(address)
    .call()
  return balance
}

export function sendTransaction(from, to, value) {
  const web3 = store.getters['ethereum/getWeb3']
  const tokenContract = new web3.eth.Contract(abi, usdtAddress())
  return await tokenContract.methods.sendTransaction({
    from: from,
    to: to,
    value: value
  })
}

/**
 * sendTransaction
 *
 * @param {String} contractAddress -> the contractAddress to send transaction to
 * @param {Wallet} senderAddress -> the transaction sender's ethereum-js Wallet object
 * @param {String} data -> The encoded ABI byte code to send via a transaction or call.
 *                          Example: myContract.methods.myMethod(123).encodeABI();
 * @param {String} value -> amount of ether to transfer
 * */
//  async function sendTransaction(contractAddress, senderWallet, data, value) {
//   const web3 = store.getters['ethereum/getWeb3']

//   let nonce = await web3.eth.getTransactionCount(senderWallet.getAddressString())

//   // Create transaction
//   const rawTx = {
//     nonce: web3.utils.toHex(nonce),
//     gasLimit: web3.utils.toHex(appConfig.getGasLimit()),
//     gasPrice: web3.utils.toHex(appConfig.getGasPrice()),
//     from: senderWallet.getAddressString(),
//     to: contractAddress,
//     data
//   }

//   if (value) {
//     rawTx.value = web3.utils.toHex(value)
//   }
//   const tx = new Transaction(rawTx)

//   // Sign transaction
//   const privateKeyBuffer = EthUtil.toBuffer(senderWallet.getPrivateKeyString())
//   tx.sign(privateKeyBuffer)

//   // Serialize transaction
//   const serializedTx = tx.serialize().toString('hex')

//   // Send transaction
//   const txReceipt = await web3.eth.sendSignedTransaction('0x' + serializedTx)

//   return txReceipt
// }

export async function changeChain(){
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
            chainId: '0x3',
            chainName: 'Ethereum Testnet',
            nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
            },
            rpcUrls: [
                'https://ropsten.infura.io/v3/undefined'
            ],
            blockExplorerUrls: [
                'https://ropsten.etherscan.io'
            ],
        }
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