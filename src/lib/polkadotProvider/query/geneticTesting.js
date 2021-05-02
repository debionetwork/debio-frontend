export async function queryDnaSamples(api, bytes){
    const res = await api.query.geneticTesting.dnaSamples(bytes)
    return res.toHuman()
}

export async function queryDnaSamplesByLab(api, labId){
    const res = await api.query.geneticTesting.dnaSamplesByLab(labId)
    return res.toHuman()
}

export async function queryDnaSamplesByOwner(api, ownerId){
    const res = await api.query.geneticTesting.dnaSamplesByOwner(ownerId)
    return res.toHuman()
}

export async function queryDnaTestResults(api, bytes){
    const res = await api.query.geneticTesting.dnaTestResults(bytes)
    return res.toHuman()
}

export async function queryDnaTestResultsByLab(api, labId){
    const res = await api.query.geneticTesting.dnaTestResultsByLab(labId)
    return res.toHuman()
}

export async function queryDnaTestResultsByOwner(api, ownerId){
    const res = await api.query.geneticTesting.dnaTestResultsByOwner(ownerId)
    return res.toHuman()
}