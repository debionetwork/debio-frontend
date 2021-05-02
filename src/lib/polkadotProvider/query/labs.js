export async function queryLabsById(api, labId){
    const res = await api.query.labs.labs(labId)
    return res.toHuman()
}

export async function queryLabsByCountryCity(api, country, city){
    const res = await api.query.labs.labsByCountryCity(country, city)
    return res.toHuman()
}

export async function queryLabCount(api){
    return await api.query.labs.labCount()
}

export async function queryLabsCountByCoutryCity(api, country, city){
    const res = await api.query.labs.labCountByCountryCity(country, city)
    return res.toHuman()
}

export async function queryLabsByIdNew(api, labId){
    const res = await api.query.labs.labs(labId)
    return res.toHuman()
  }