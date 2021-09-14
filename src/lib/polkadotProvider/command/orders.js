export async function createOrder(api, pair, service_id, customer_box_public_key, priceIndex) {
  const result = await api.tx.orders
    .createOrder(service_id, priceIndex, customer_box_public_key)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}

export async function fulfillOrder(api, pair, order_id, callback = ()=>{}) {
  const unsub = await api.tx.orders
    .fulfillOrder(order_id)
    .signAndSend(pair, { nonce: -1 }, ({ events, status }) => 
      successCallback(api, { events, status, callback, unsub })
    )
}

export async function refundOrder(api, pair, order_id) {
  const result = await api.tx.orders
    .refundOrder(order_id)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}

export async function setOrderPaid(api, pair, order_id) {
  const result = await api.tx.orders
    .setOrderPaid(order_id)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}

export async function cancelOrder(api, pair, order_id) {
  const result = await api.tx.orders
    .cancelOrder(order_id)
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