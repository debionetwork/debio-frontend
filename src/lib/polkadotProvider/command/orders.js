export async function createOrder(api, pair, service_id, customer_box_public_key, priceIndex) {
  const result = await api.tx.orders
    .createOrder(service_id, priceIndex, customer_box_public_key)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}

export async function fulfillOrder(api, pair, order_id) {
  const result = await api.tx.orders
    .fulfillOrder(order_id)
    .signAndSend(pair, { nonce: -1 }, ({ status, events }) => {
      if (status.isInBlock || status.isFinalized) {
        events
          // find/filter for failed events
          .filter(({ event }) =>
            api.events.system.ExtrinsicFailed.is(event)
          )
          // we know that data for system.ExtrinsicFailed is
          // (DispatchError, DispatchInfo)
          .forEach(({ event: { data: [error, info] } }) => {
            info
            if (error.isModule) {
              // for module errors, we have the section indexed, lookup
              const decoded = api.registry.findMetaError(error.asModule);
              const { documentation, method, section } = decoded;

              console.log(`${section}.${method}: ${documentation.join(' ')}`);
            } else {
              // Other, CannotLookup, BadOrigin, no extra info
              console.log(error.toString());
            }
          });
      }
    })

  console.log(result)
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
