export async function registerDoctor(api, pair, data){
    const result = await api.tx.doctors
        .registerDoctor(data)
        .signAndSend(pair, { nonce: -1 })
    return result.toHuman()
}

export async function updateDoctor(api, pair, data){
    const result = await api.tx.doctors
        .updateDoctor(data)
        .signAndSend(pair, { nonce: -1 })
    return result.toHuman()
}

export async function deregisterDoctor(api, pair){
    const result = await api.tx.doctors
        .deregisterDoctor()
        .signAndSend(pair, { nonce: -1 })
    return result.toHuman()
}