export async function queryLabsById(api, labId){
    const res = await api.query.labs.labs(labId)
    return res.toHuman()
}

export async function queryLabsByCountryRegionCity(api, countryRegion, city){
    const res = await api.query.labs.labsByCountryRegionCity(countryRegion, city)
    return res.toHuman()
}

export async function queryLabCount(api){
    return await api.query.labs.labCount()
}

export async function queryLabsCountByCountryRegionCity(api, countryRegion, city){
    const res = await api.query.labs.labCountByCountryRegionCity(countryRegion, city)
    return res.toHuman()
}

export async function queryLabsByIdNew(api, labId){
    const res = await api.query.labs.labs(labId)
    return res.toHuman()
  }