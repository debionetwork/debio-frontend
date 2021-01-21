/**
 * getWalletBalance
 * 
 * @param {Object} web3 
 * @param {String} walletAddress 
 * @returns {String} wallet balance in ether
 */
async function getWalletBalance(web3, walletAddress) {
  let balance = await web3.eth.getBalance(walletAddress)
  let ethBalance = web3.utils.fromWei(balance, 'ether')
  var decimalIndex = balance.indexOf('.') + 1
  var digits = 7
  ethBalance = ethBalance.substring(0, decimalIndex != -1 ? decimalIndex + digits : ethBalance.length)

  return ethBalance
}

export default getWalletBalance