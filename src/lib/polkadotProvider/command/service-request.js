export async function finalizeServiceRequest(api, pair, requestId) {
  const result = await api.tx.serviceRequest
    .finalizeRequest(requestId)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}
