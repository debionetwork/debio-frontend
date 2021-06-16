export async function registerHospital(api, pair, data){
    const result = await api.tx.hospitals
        .registerHospital(data)
        .signAndSend(pair, { nonce: -1 })
    return result.toHuman()
}

export async function updateHospital(api, pair, data){
    const result = await api.tx.hospitals
        .updateHospital(data)
        .signAndSend(pair, { nonce: -1 })
    return result.toHuman()
}

export async function deregisterHospital(api, pair){
    const result = await api.tx.hospitals
        .deregisterHospital()
        .signAndSend(pair, { nonce: -1 })
    return result.toHuman()
}