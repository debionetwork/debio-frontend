import { labCommandCallback } from '@/lib/polkadotProvider/command/labs'

export async function createService(api, pair, serviceInfo, serviceFlow, callback = () => {}){
    const unsub = await api.tx.services
        .createService(serviceInfo, serviceFlow)
        .signAndSend(pair, { nonce: -1 }, async ({ events = [], status }) => {
            await labCommandCallback(api, pair, { events, status, callback, unsub })
        })
}

export async function updateService(api, pair, id, serviceInfo, callback = () => {}){
    const unsub = await api.tx.services
        .updateService(id, serviceInfo)
        .signAndSend(pair, { nonce: -1 }, async ({ events = [], status }) => {
            await labCommandCallback(api, pair, { events, status, callback, unsub })
        })
}

export async function deleteService(api, pair, serviceId, callback = () => {}){
    const unsub = await api.tx.services
        .deleteService(serviceId)
        .signAndSend(pair, { nonce: -1 }, async ({ events = [], status }) => {
            await labCommandCallback(api, pair, { events, status, callback, unsub })
        })
}