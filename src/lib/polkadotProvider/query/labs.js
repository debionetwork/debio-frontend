import { Keyring } from '@polkadot/keyring'

export async function queryLabsById(api, labId){
    return await api.query.labs.labs(labId)
}

export async function queryLabsByCountryCity(api, country, city){
    const keyring = new Keyring()
    const res = (await api.query.labs.labsByCountryCity(country, city)).value

    let labs = []
    for(let i = 0; i < res.length; i++){
        labs.push(keyring.encodeAddress(res[i], 42))
    }
    return labs
}

export async function queryLabCount(api){
    return await api.query.labs.labCount()
}

export async function queryLabsCountByCoutryCity(api, country, city){
    return await api.query.labs.labsCountByCoutryCity(country, city)
}