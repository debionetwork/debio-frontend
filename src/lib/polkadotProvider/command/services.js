export async function createService(api, pair, data){
    const result = await api.tx.services
        .createService(data)
        .signAndSend(pair, { nonce: -1 })
    return result.toHuman()
}

export async function updateService(api, pair, id, data){
    const result = await api.tx.services
        .updateService(id, data)
        .signAndSend(pair, { nonce: -1 })
    return result.toHuman()
}

export async function deleteService(api, pair, serviceId){
    const result = await api.tx.services
        .deleteService(serviceId)
        .signAndSend(pair, { nonce: -1 })
    return result.toHuman()
}