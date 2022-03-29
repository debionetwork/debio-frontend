export async function ethAddressByAccountId(api, address) {
  const res = await api.query.userProfile.ethAddressByAccountId(address)
  return res.toHuman()
}

export async function accountIdByEthAddress(api, ethAddress) {
  const res = await api.query.userProfile.accountIdByEthAddress(ethAddress)
  return res.toHuman()
}
