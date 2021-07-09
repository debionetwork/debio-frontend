import { labCommandCallback } from '@/lib/polkadotProvider/command/labs'

export async function createService(api, pair, data, callback = () => {}){
    const unsub = await api.tx.services
        .createService(data)
        .signAndSend(pair, { nonce: -1 }, async ({ events = [], status }) => {
            if (status.isFinalized) {
                await labCommandCallback(api, pair, events) 
                callback()
                unsub()
            }
        })
}

export async function updateService(api, pair, id, data, callback = () => {}){
    const unsub = await api.tx.services
        .updateService(id, data)
        .signAndSend(pair, { nonce: -1 }, async ({ events = [], status }) => {
            if (status.isInBlock || status.isFinalized) {
                await labCommandCallback(api, pair, events) 
                callback()
                unsub()
            }
        })
}

export async function deleteService(api, pair, serviceId, callback = () => {}){
    const unsub = await api.tx.services
        .deleteService(serviceId)
        .signAndSend(pair, { nonce: -1 }, async ({ events = [], status }) => {
            if (status.isInBlock || status.isFinalized) {
                await labCommandCallback(api, pair, events) 
                callback()
                unsub()
            }
        })
}