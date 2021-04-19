import { Keyring } from '@polkadot/keyring'

export async function queryServicesById(api, serviceId){
    return await api.query.services.services(serviceId)
}

export async function queryServicesByCountryCity(api, country, city){
    const keyring = new Keyring()
    const res = (await api.query.services.servicesByCountryCity(country, city)).value

    let services = []
    for(let i = 0; i < res.length; i++){
        services.push(keyring.encodeAddress(res[i], 42))
    }
    return services
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