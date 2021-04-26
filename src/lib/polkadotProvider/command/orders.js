export async function createOrder(api, pair, service_id) {
  return await api.tx.orders
    .createOrder(service_id)
    .signAndSend(pair)
}

export async function fulfillOrder(api, pair, order_id) {
  return await api.tx.orders
    .fulfillOrder(order_id)
    .signAndSend(pair)
}

export async function refundOrder(api, pair, order_id) {
  return await api.tx.orders
    .refundOrder(order_id)
    .signAndSend(pair)
}

export async function setOrderPaid(api, pair, order_id) {
  return await api.tx.orders
    .setOrderPaid(order_id)
    .signAndSend(pair)
}