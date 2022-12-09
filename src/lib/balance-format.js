import store from "@/store"

const web3 = store.getters["metamask/getWeb3"]

export function fromEther(balance, currency) {
  let unit
  currency === "USDT" || currency === "USDTE" ? unit = "mwei" : unit = "ether"
  const formatedBalance = web3.utils.fromWei(String(balance.replaceAll(",", "")), unit)
  return formatedBalance
}

export async function toEther(balance, currency) {
  let unit
  currency === "USDT" || currency === "USDT.e" || currency === "USDTE"  ? unit = "mwei" : unit = "ether"
  const formatedBalance = web3.utils.toWei(String(balance), unit)
  return formatedBalance
}


export function formatUSDTE(currency) {
  if (currency === "USDT.e") return "USDTE"
  if (currency === "USDTE") return "USDT.e"
  return currency
}
