import store from "../store"
import appConfig from "./app-config"
import * as EthUtil from "ethereumjs-util"
import Transaction from "ethereumjs-tx"

/**
 * sendTransaction
 *
 * @param {String} contractAddress -> the contractAddress to send transaction to
 * @param {Wallet} senderAddress -> the transaction sender's ethereum-js Wallet object
 * @param {String} data -> The encoded ABI byte code to send via a transaction or call.
 *                          Example: myContract.methods.myMethod(123).encodeABI();
 * @param {String} value -> amount of ether to transfer
 * */
async function sendTransaction(contractAddress, senderWallet, data, value) {
  const web3 = store.getters["ethereum/getWeb3"]

  let nonce = await web3.eth.getTransactionCount(senderWallet.getAddressString())

  // Create transaction
  const rawTx = {
    nonce: web3.utils.toHex(nonce),
    gasLimit: web3.utils.toHex(appConfig.getGasLimit()),
    gasPrice: web3.utils.toHex(appConfig.getGasPrice()),
    from: senderWallet.getAddressString(),
    to: contractAddress,
    data
  }

  if (value) {
    rawTx.value = web3.utils.toHex(value)
  }
  const tx = new Transaction(rawTx)

  // Sign transaction
  const privateKeyBuffer = EthUtil.toBuffer(senderWallet.getPrivateKeyString())
  tx.sign(privateKeyBuffer)

  // Serialize transaction
  const serializedTx = tx.serialize().toString("hex")

  // Send transaction
  const txReceipt = await web3.eth.sendSignedTransaction("0x" + serializedTx)

  return txReceipt
}

export default sendTransaction
