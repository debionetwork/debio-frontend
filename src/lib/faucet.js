import axios from 'axios'
import store from '@/store/index'

/**
 * 
 * @param {String} walletAddress 
 */
export async function getEthFromFaucet(walletAddress) {
  console.log('getting eth from faucet')
  const faucetEndpoint = store.getters['auth/getConfig'].urlFaucet;
  const request = `${faucetEndpoint}?address=${walletAddress}`
  try {
    const resp = await axios.get(request)
    console.log(resp)
    return resp.data
  } catch (err) {
    console.log(err)
  }
}

export async function getDaicFromFaucet(walletAddress) {
  console.log('getting daic from faucet')
  const faucetEndpoint = store.getters['auth/getConfig'].urlFaucet;
  const request = `${faucetEndpoint}?address=${walletAddress}&daic=true`
  try {
    const resp = await axios.get(request)
    console.log(resp)
    return resp.data
  } catch (err) {
    console.log(err)
  }
}

export async function getDbioFromFaucet(walletAddress) {
  const faucetEndpoint = store.getters['auth/getConfig'].urlFaucet;
  const request = `${faucetEndpoint}?address=${walletAddress}`
  try {
    const resp = await axios.get(request)
    console.log(resp)
  } catch (err) {
    console.log(err)
  }
}
