import store from '../../store'
import contractInfo from '@/store/metamask/contracts/contract.json'
import { sendTransaction } from './wallet'
import { getOrdersData } from "@/lib/polkadotProvider/query/orders";


/**
 * payOrder
 * 
 * @param {string} orderId
 * @param {string} serviceId
 * @param {string} customerSubstrateAddress
 * @param {string} sellerSubstrateAddress
 * @param {string} customerEthAddress
 * @param {string} sellerEthAddress
 * @param {string} dnaSampleTrackingId
 * @param {string | number} testingPrice
 * @param {string | number} qcPrice 
 * @param {string | number} payAmount
 * 
 * @returns
 * 
 */

// orderId, serviceId, customerSubstrateAddress, sellerSubstrateAddress, customerEthAddress, sellerEthAddress, dnaSampleTrackingId, testingPrice, qcPrice, payAmount
export async function sendPaymentEscrow(api, orderId, ethAccount, sellerEth) {
  const contracEscrowInterface = store.getters['metamask/contracts/getEscrowContract']
  const web3 = store.getters['metamask/getWeb3']
  const currentData = await getOrdersData(api, orderId);

  const serviceId = currentData.serviceId
  const customerSubstrateAddress = currentData.customerId
  const sellerSubstrateAddress = currentData.sellerId
  const customerEthAddress = ethAccount.currentAccount
  const sellerEthAddress = sellerEth
  const dnaSampleTrackingId = currentData.dnaSampleTrackingId
  const testingPrice = currentData.prices[0].value
  const qcPrice = currentData.additionalPrices[0].value
  const payAmount = (parseFloat(testingPrice) + parseFloat(qcPrice)).toFixed(2);

  console.log({
    serviceId,
    customerSubstrateAddress,
    sellerSubstrateAddress,
    customerEthAddress,
    sellerEthAddress,
    dnaSampleTrackingId,
    testingPrice,
    qcPrice,
    payAmount
  })

  const txData = contracEscrowInterface.methods
    .payOrder(
      orderId,
      serviceId,
      customerSubstrateAddress,
      sellerSubstrateAddress,
      customerEthAddress,
      sellerEthAddress,
      dnaSampleTrackingId,
      testingPrice,
      qcPrice,
      web3.utils.toWei(String(payAmount), 'ether')
    )
    .encodeABI()

    const txHash = await sendTransaction(
    contractInfo.Escrow.address,
    txData,
    customerEthAddress
  )
  
  return txHash
}