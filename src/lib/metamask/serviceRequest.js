import store from '../../store'
import contractInfo from '@/store/metamask/contracts/contract.json'
import { sendTransaction } from './wallet'


/**
 * approveDaiStakingAmount
 * 
 * Before sending a service request, user must approve
 * that the staking amount of DAI will be transffered 
 * by the serviceRequest contract
 * 
 * @param {string} stakerAddress
 * @param {string | number} stakingAmount
 */
export async function approveDaiStakingAmount(stakerAddress, stakingAmount) {
  const contractERC20Interface = store.getters['metamask/contracts/getERC20InterfaceContract'];
  const web3 = store.getters['metamask/getWeb3']

  const txData = contractERC20Interface.methods.approve(
    contractInfo.ServiceRequest.address,
    web3.utils.toWei(String(stakingAmount), 'ether') // Convert to 18 decimal places
  ).encodeABI()

  const txHash = await sendTransaction(
    contractInfo.DAIToken.address,
    txData,
    stakerAddress
  )

  return txHash
}

/**
 * checkAllowance
 * 
 * check amount of DAI token allowance in the ServiceRequest contract
 * 
 * @param {string} userAddress 
 * @returns string
 */
export async function checkAllowance(userAddress) {
  const contractERC20Interface = store.getters['metamask/contracts/getERC20InterfaceContract'];

  let balance = await contractERC20Interface.methods
    .allowance(userAddress, contractInfo.ServiceRequest.address).call()
  
  const web3 = store.getters['metamask/getWeb3']

  return web3.utils.fromWei(balance, 'ether')
}

/**
 * sendServiceRequestStaking
 * 
 * Send a createRequest transaction to ServiceRequest contract
 * 
 * @param {string} stakerAddress 
 * @param {string} country 
 * @param {string} city 
 * @param {string} serviceCategory 
 * @param {string} stakingAmount 
 * @returns 
 */
export async function sendServiceRequestStaking(stakerAddress, country, city, serviceCategory, stakingAmount) {
  const contractServiceRequestInterface = store.getters['metamask/contracts/getServiceRequestContract']
  const web3 = store.getters['metamask/getWeb3']

  const txData = contractServiceRequestInterface.methods
    .createRequest(
      country,
      city,
      serviceCategory,
      web3.utils.toWei(String(stakingAmount), 'ether') // Convert to 18 decimal places
    )
    .encodeABI()

  const txHash = await sendTransaction(
    contractInfo.ServiceRequest.address,
    txData,
    stakerAddress
  )

  return txHash
}