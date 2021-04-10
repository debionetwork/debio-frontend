import axios from 'axios'

/**
 * 
 * @param {String} walletAddress 
 */
export async function getEthFromFaucet(walletAddress) {
  console.log('getting eth from faucet')
  const faucetEndpoint = process.env.VUE_APP_DEGENICS_BACKEND_URL
  const request = `${faucetEndpoint}?address=${walletAddress}`
  try {
    const resp = await axios.get(request)
    console.log(resp)
    return resp.data
  } catch (err) {
    console.log(err)
  }
}

