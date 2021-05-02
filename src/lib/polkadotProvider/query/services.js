export async function queryServicesById(api, serviceId){
    const res = await api.query.services.services(serviceId)
    return res.toHuman()
}

export async function queryServicesByCountryCity(api, country, city){
    const res = await api.query.services.servicesByCountryCity(country, city)
    return res.toHuman()
}

export async function queryServicesCount(api){
    return await api.query.services.servicesCount()
}

export async function queryServicesCountByCoutryCity(api, country, city){
    return await api.query.services.servicesCountByCoutryCity(country, city)
}

export async function queryServicesCountByOwnerId(api, accoutId){
    return await api.query.services.servicesCountByOwner(accoutId)
}