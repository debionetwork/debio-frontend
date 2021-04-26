import { Keyring } from '@polkadot/keyring'

export async function queryDnaSamples(api, bytes){
    const res = await api.query.geneticTesting.dnaSamples(bytes)
    return res.toHuman()
}

export async function queryDnaSamplesByLab(api, labId){
    const keyring = new Keyring()
    const res = (await api.query.geneticTesting.dnaSamplesByLab(labId)).value

    let dnaSampleTrackingIds = []
    for(let i = 0; i < res.length; i++){
        dnaSampleTrackingIds.push(keyring.encodeAddress(res[i], 42))
    }
    return dnaSampleTrackingIds
}

export async function queryDnaSamplesByOwner(api, ownerId){
    const keyring = new Keyring()
    const res = (await api.query.geneticTesting.dnaSamplesByOwner(ownerId)).value

    let dnaSampleTrackingIds = []
    for(let i = 0; i < res.length; i++){
        dnaSampleTrackingIds.push(keyring.encodeAddress(res[i], 42))
    }
    return dnaSampleTrackingIds
}

export async function queryDnaTestResults(api, bytes){
    const res = await api.query.geneticTesting.dnaTestResults(bytes)
    return res.toHuman()
}

export async function queryDnaTestResultsByLab(api, labId){
    const keyring = new Keyring()
    const res = (await api.query.geneticTesting.dnaTestResultsByLab(labId)).value

    let dnaSampleTrackingIds = []
    for(let i = 0; i < res.length; i++){
        dnaSampleTrackingIds.push(keyring.encodeAddress(res[i], 42))
    }
    return dnaSampleTrackingIds
}

export async function queryDnaTestResultsByOwner(api, ownerId){
    const keyring = new Keyring()
    const res = (await api.query.geneticTesting.dnaTestResultsByOwner(ownerId)).value

    let dnaSampleTrackingIds = []
    for(let i = 0; i < res.length; i++){
        dnaSampleTrackingIds.push(keyring.encodeAddress(res[i], 42))
    }
    return dnaSampleTrackingIds
}