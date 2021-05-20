import store from '../../store'
import appConfig from '@/lib/app-config'

export async function getWalletAddress() {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
  return accounts[0]
}

export async function changeChain() {
  await window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '0x7E5',
        chainName: 'Debio Testnet',
        nativeCurrency: {
          name: 'DEBIO',
          symbol: 'USDT',
          decimals: 18,
        },
        rpcUrls: [
          'https://testnet.theapps.dev/rpc'
        ],
        blockExplorerUrls: [
          'https://ropsten.etherscan.io'
        ],
      }
    ],
  });
}

export async function addTokenUsdt() {
  try {
    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address: '0xaf622dd428F0e35f6CC48A0756A93E32441060a8', // The address that the token is at.
          symbol: 'USDT', // A ticker symbol or shorthand, up to 5 chars.
          decimals: 8, // The number of decimals in the token
          image: 'https://s2.coinmarketcap.com/static/img/coins/200x200/825.png', // A string url of the token logo
        },
      },
    });
    if (!wasAdded) {
      console.log('Failed to add USDT token!');
      return false;
    } else {
      return true;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function getBalance() {
  const contractERC20Interface = store.getters['metamask/contracts/getERC20InterfaceContract'];
  let balance = await contractERC20Interface.methods
    .balanceOf(window.ethereum.selectedAddress).call()
  return balance
}

/**
 * sendTransaction
 * @param {Wallet} to -> the transaction sender's ethereum-js Wallet object
 * @param {String} data -> The encoded ABI byte code to send via a transaction or call.
 *                          Example: myContract.methods.myMethod(123).encodeABI();
 * */
export async function sendTransaction(to, data, from) {
  const web3 = store.getters['metamask/getWeb3']

  const transactionParameters = {
    to: to, // Required except during contract publications.
    gasPrice: web3.utils.toHex(appConfig.getGasPrice()), // customizable by user during MetaMask confirmation.
    gas: web3.utils.toHex(appConfig.getGasLimit()),
    from: from, // must match user's active address.
    data: data, // Optional, but used for defining smart contract creation and interaction.
    chainId: '0x7E5', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
  };

  // txHash is a hex string
  // As with any RPC call, it may throw an error
  const txHash = await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [transactionParameters],
  });
  return txHash;
}

export async function transfer(data) {
  const contractInfo = require('@/store/metamask/contracts/contract.json')
  const contractERC20Interface = store.getters['metamask/contracts/getERC20InterfaceContract'];

  let raw = contractERC20Interface.methods.transfer(data.seller, data.amount).encodeABI()

  let receipt = await sendTransaction(contractInfo.USDTTokenAddress.address, raw, data.from)
  return { data, receipt }

}

export async function listenEventEscrow() {
  const contractSingleEscrow = store.getters['metamask/contracts/getSingleEscrowContract'];
  const singleEscrowAbi = store.getters['metamask/contracts/getSingleEscrowAbi'];
  for (let p of singleEscrowAbi) {
    // jika type property adalah event maka buat listener
    if (p.type == 'event' && typeof contractSingleEscrow.events[p.name] == 'function') {
      contractSingleEscrow.events[p.name]({}).on('data', (event) => {
        console.log('handler', event)
        /********************************************************************************* 
         * contoh data event deposit
         * 
            {
            logIndex: 0,
            removed: false,
            blockNumber: 4348746,
            blockHash: '0x42c67d7516dac205575d3df47c7560d22987ffb3f963e9ba3d3daf34ca1129dc',
            transactionHash: '0x741737ece9652c7b30d3f425f629ed17bc16c154242769c4837c8ea9a48af095',
            transactionIndex: 0,
            address: '0x8858E40ab8eFd7694610b0B65bA3BAe3AdaCAB06',
            id: 'log_5cc4153a',
            returnValues: Result {
                '0': '0xD123aF6C439D546DD322c4e445F4B7c3C49C80f3',
                payer: '0xD123aF6C439D546DD322c4e445F4B7c3C49C80f3'
            },
            event: 'Deposit',
            signature: '0x8ce0bd46ec50cf39f0d0ea8686a686eb226af5796dcda4231b26fb84b5ef1234',
            raw: {
                data: '0x000000000000000000000000d123af6c439d546dd322c4e445f4b7c3c49c80f3',
                topics: [
                '0x8ce0bd46ec50cf39f0d0ea8686a686eb226af5796dcda4231b26fb84b5ef1234'
                ]
            }
        */
      })
    }
  }
}