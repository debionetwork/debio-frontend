import { labCommandCallback } from "@/lib/polkadotProvider/command/labs"

export async function claimRequestService(api, pair, service, callback = () => {}){
  const unsub = await api.tx.serviceRequest
    .claimRequest(service.hash, service.id)
    .signAndSend(pair, { nonce: -1 }, async ({ events = [], status }) => {
      await labCommandCallback(api, pair, { events, status, callback, unsub })
    })
}

export async function claimRequestServiceFee(api, pair, service) {
  const result = await api.tx.serviceRequest
    .claimRequest(service.hash, service.id)
    .paymentInfo(pair)
  return result
}

export async function createService(api, pair, serviceInfo, serviceFlow, callback = () => {}){
  const unsub = await api.tx.services
    .createService(serviceInfo, serviceFlow)
    .signAndSend(pair, { nonce: -1 }, async ({ events = [], status }) => {
      await labCommandCallback(api, pair, { events, status, callback, unsub })
    })
}

export async function createServiceFee(api, pair, serviceInfo, serviceFlow) {
  const result = await api.tx.services
    .createService(serviceInfo, serviceFlow)
    .paymentInfo(pair)
  return result
}

export async function updateService(api, pair, id, serviceInfo, callback = () => {}){
  const unsub = await api.tx.services
    .updateService(id, serviceInfo)
    .signAndSend(pair, { nonce: -1 }, async ({ events = [], status }) => {
      await labCommandCallback(api, pair, { events, status, callback, unsub })
    })
}

export async function updateServiceFee(api, pair, id, serviceInfo ) {
  const result = await api.tx.services
    .updateService(id, serviceInfo)
    .paymentInfo(pair)
  return result
}

export async function deleteService(api, pair, serviceId, callback = () => {}){
  const unsub = await api.tx.services
    .deleteService(serviceId)
    .signAndSend(pair, { nonce: -1 }, async ({ events = [], status }) => {
      await labCommandCallback(api, pair, { events, status, callback, unsub })
    })
}

export async function deleteServiceFee(api, pair, serviceId) {
  const result = await api.tx.services
    .deleteService(serviceId)
    .paymentInfo(pair)
  return result
}
