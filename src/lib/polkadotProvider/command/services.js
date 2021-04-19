export async function createService(api, pair, data){
    return await api.tx.services
        .createService(data)
        .signAndSend(pair)
}

export async function updateService(api, pair, data){
    return await api.tx.services
        .updateService(data)
        .signAndSend(pair)
}

export async function deleteService(api, pair, data){
    return await api.tx.services
        .deleteService(data)
        .signAndSend(pair)
}