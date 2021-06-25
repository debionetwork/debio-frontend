import { labCommandCallback } from '@/lib/polkadotProvider/command/labs'

export async function createService(api, pair, data){
    await api.tx.services
        .createService(data)
        .signAndSend(pair, { nonce: -1, callback: async (res) => {
            await labCommandCallback(api, pair, res) 
        }})
}

export async function updateService(api, pair, id, data){
    await api.tx.services
        .updateService(id, data)
        .signAndSend(pair, { nonce: -1, callback: async (res) => {
            await labCommandCallback(api, pair, res) 
        }})
}

export async function deleteService(api, pair, serviceId){
    await api.tx.services
        .deleteService(serviceId)
        .signAndSend(pair, { nonce: -1, callback: async (res) => {
            await labCommandCallback(api, pair, res) 
        }})
}