// set EthereumAddress to pallet
export async function setUsdtAddress(api, pair, usdt_address) {
  const result = await api.tx.userProfile
    .setUsdtAddress(usdt_address)
    .signAndSend(pair)
  return result.toHuman()
}