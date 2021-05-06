export async function registerLab(api, pair, data){
    const result = await api.tx.labs
        .registerLab(data)
        .signAndSend(pair)
    return result.toHuman()
}

export async function updateLab(api, pair, data){
    const result = await api.tx.labs
        .updateLab(data)
        .signAndSend(pair)
    return result.toHuman()
}

export async function deregisterLab(api, pair){
    const result = await api.tx.labs
        .deregisterLab()
        .signAndSend(pair)
    return result.toHuman()
}