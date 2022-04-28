import store from "../../store"
// import appConfig from '@/lib/app-config'
import BigNumber from "bignumber.js"

export async function getWalletAddress() {
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
  return accounts[0]
}

export async function changeChain() {
  await window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: "0x7E5",
        chainName: "Debio Testnet",
        nativeCurrency: {
          name: "DEBIO",
          symbol: "USDT",
          decimals: 18
        },
        rpcUrls: [
          "https://testnet.theapps.dev/rpc"
        ],
        blockExplorerUrls: [
          "https://ropsten.etherscan.io"
        ]
      }
    ]
  });
}


export async function addTokenDAI() {
  try {
    const wasAdded = await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20", // Initially only supports ERC20, but eventually more!
        options: {
          address: process.env.VUE_APP_DEBIO_DAI_TOKEN_ADDRESS, // The address that the token is at.
          symbol: "DAI", // A ticker symbol or shorthand, up to 5 chars.
          decimals: 18, // The number of decimals in the token
          image: "https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png" // A string url of the token logo
        }
      }
    });
    if (!wasAdded) {
      console.log("Failed to add DAI token!");
      return false;
    } else {
      return true;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function getBalanceETH(address) {
  try {
    const web3 = store.getters["metamask/getWeb3"]
    let balance = await web3.eth.getBalance(address);
    let ethBalance = web3.utils.fromWei(balance, "ether");
    var decimalIndex = balance.indexOf(".") + 1;
    var digits = 7;
    ethBalance = ethBalance.substring(0, decimalIndex != -1 ? decimalIndex + digits : ethBalance.length);

    return ethBalance;
  } catch (e) {
    return 0;
  }
}

export async function getBalanceDAI(address) {
  const contractERC20Interface = store.getters["metamask/contracts/getERC20InterfaceContract"]
  const web3 = store.getters["metamask/getWeb3"]

  let balance = await contractERC20Interface.methods.balanceOf(address).call()
  let daiBalance = web3.utils.fromWei(balance, "ether")

  return daiBalance
}

export async function getBalanceUSDT() {
  const contractERC20Interface = store.getters["metamask/contracts/getERC20InterfaceContract"];
  let balance = await contractERC20Interface.methods
    .balanceOf(window.ethereum.selectedAddress).call()
  return balance
}

export async function getPrice(priceOrder) {
  let decimalPlaces = 18
  try {
    // FIXME: get decimals from contract interface still returns error
    const contractERC20Interface = store.getters["metamask/contracts/getERC20InterfaceContract"];
    decimalPlaces = await contractERC20Interface.methods
      .decimals().call();
  } catch (err) {
    decimalPlaces = 18
  }

  let price = BigNumber(priceOrder).toString()
  let _decimals = parseInt(decimalPlaces)
  for (let i = 0; i < _decimals; i++) {
    price += "0"
  }

  return price
}

/**
 * sendTransaction
 * @param {Wallet} to -> the transaction sender's ethereum-js Wallet object
 * @param {String} data -> The encoded ABI byte code to send via a transaction or call.
 *                          Example: myContract.methods.myMethod(123).encodeABI();
 * */
export async function sendTransaction(to, data, from) {
  // const web3 = store.getters['metamask/getWeb3']
  const transactionParameters = {
    to: to, // Required except during contract publications.
    // gasPrice: web3.utils.toHex(appConfig.getGasPrice()), // customizable by user during MetaMask confirmation.
    // gas: web3.utils.toHex(appConfig.getGasLimit()),
    maxFeePerGas: "2000000000",
    maxPriorityFeePerGas: "1000000000",
    from: from, // must match user's active address.
    data: data, // Optional, but used for defining smart contract creation and interaction.
    chainId: "0x4" // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
  };

  // txHash is a hex string
  // As with any RPC call, it may throw an error
  const txHash = await window.ethereum.request({
    method: "eth_sendTransaction",
    params: [transactionParameters]
  });
  return txHash;
}

export async function transfer(data) {
  const contractERC20Interface = store.getters["metamask/contracts/getERC20InterfaceContract"];

  let raw = contractERC20Interface.methods.transfer(data.seller, data.amount).encodeABI()

  let receipt;
  let contractAddress;
  contractAddress = process.env.VUE_APP_DEBIO_DAI_TOKEN_ADDRESS;
  receipt = await sendTransaction(contractAddress, raw, data.from);

  return { data, receipt }

}


export async function addToken(coinName) {
  switch (coinName) {
  case "Dai":
    await addTokenDAI();
    break;
  default:
    console.log("not trigger");
    break;
  }
}
