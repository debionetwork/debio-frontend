import { queryServicesById } from './services'

export async function queryLabsById(api, labId){
    const res = await api.query.labs.labs(labId)
    return res.toHuman()
}

export async function queryEntireLabDataById(api, labId){
    const res = (await api.query.labs.labs(labId)).toHuman()
    const servicesDetailedList = []
    for(let i = 0; i < res.services.length; i++){
        let serviceDetail = await queryServicesById(api, res.services[i])
        if(serviceDetail.info.image == null){
            serviceDetail.info.image = "https://www.azutura.com/media/catalog/product/cache/47/image/650x/040ec09b1e35df139433887a97daa66f/W/S/WS-45551_WP.jpg"
        }
        servicesDetailedList.push(serviceDetail)
    }
    res.services = servicesDetailedList
    return res
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