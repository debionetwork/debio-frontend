export async function registerLab(api, pair, data){
    // const data = {
    //     "name": "Singapore Hololive Lab Kawaii",
    //     "country": "Singapore",
    //     "city": "Singapore",
    //     "address": "you will never know"
    // }
    return await api.tx.labs
        .registerLab(data)
        .signAndSend(pair)
}

export async function updateLab(api, pair, data){
    return await api.tx.labs
        .updateLab(data)
        .signAndSend(pair)
}

export async function deregisterLab(api, pair, data){
    return await api.tx.labs
        .deregisterLab(data)
        .signAndSend(pair)
}