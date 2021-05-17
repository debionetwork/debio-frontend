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
            serviceDetail.info.image = "https://images.unsplash.com/photo-1578496779937-3815e442abed?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80"
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