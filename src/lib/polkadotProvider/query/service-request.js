export async function getRequestByOrderId(api, orderId){
  const res = await api.query.serviceRequest.requestByOrderId(orderId)
  return res.toHuman()
}

export async function getRequestById(api, requestId) {
  const res = await api.query.serviceRequest.requestById(requestId)
  return res.toHuman()  
}
