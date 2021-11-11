export async function createOrder(api, pair, serviceId, customerBoxPublicKey, priceIndex) {
  const result = await api.tx.orders
    .createOrder(serviceId, priceIndex, customerBoxPublicKey)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}

export async function fulfillOrder(api, pair, orderId, callback = ()=>{}) {
  const unsub = await api.tx.orders
    .fulfillOrder(orderId)
    .signAndSend(pair, { nonce: -1 }, ({ events, status }) => 
      successCallback(api, { events, status, callback, unsub })
    )
}

export async function refundOrder(api, pair, orderId) {
  const result = await api.tx.orders
    .refundOrder(orderId)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}

export async function setOrderPaid(api, pair, orderId) {
  const result = await api.tx.orders
    .setOrderPaid(orderId)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}

export async function cancelOrder(api, pair, orderId) {
  const result = await api.tx.orders
    .cancelOrder(orderId)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}

function successCallback(api, { events, status, callback, unsub }){
  if (status.isFinalized) {
    // find/filter for success events
    const eventList = events.filter(({ event }) =>
      api.events.system.ExtrinsicSuccess.is(event)
    )
    if(eventList.length > 0){
      callback()
      unsub()
    }
  }
}