import axios from 'axios'

/**
 * 
 * @param {String} walletAddress 
 */
export async function getEthFromFaucet(walletAddress) {
  console.log('getting eth from faucet')
  const faucetEndpoint = 'http://34.101.116.238:3000'
  const request = `${faucetEndpoint}?address=${walletAddress}`
  try {
    const resp = await axios.get(request)
    console.log(resp)
    return resp.data
  } catch (err) {
    console.log(err)
  }
}

