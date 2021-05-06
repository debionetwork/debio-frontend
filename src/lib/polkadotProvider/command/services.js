export async function createService(api, pair, data){
    const result = await api.tx.services
        .createService(data)
        .signAndSend(pair)
    return result.toHuman()
}

export async function updateService(api, pair, data){
    const result = await api.tx.services
        .updateService(data)
        .signAndSend(pair)
    return result.toHuman()
}

export async function deleteService(api, pair, serviceId){
    const result = await api.tx.services
        .deleteService(serviceId)
        .signAndSend(pair)
    return result.toHuman()
}