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

export async function getDbioFromFaucet(walletAddress) {
  const faucetEndpoint = 'https://faucet.theapps.dev'
  //const faucetEndpoint = 'http://localhost:3003'
  const request = `${faucetEndpoint}?address=${walletAddress}`
  try {
    const resp = await axios.get(request)
    console.log(resp)
  } catch (err) {
    console.log(err)
  }
}
