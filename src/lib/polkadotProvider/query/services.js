export async function queryServicesById(api, serviceId){
    const res = await api.query.services.services(serviceId)
    return res.toHuman()
}

export async function queryServicesInfoIdList(api, serviceIdList){
    let servicesData = []
    for(let i=0; i<serviceIdList.length; i++){
        let res = await queryServicesById(api, serviceIdList[i])
        servicesData.push(res.info)
    }
    return servicesData
}

export async function queryServicesCount(api){
    return await api.query.services.servicesCount()
}

export async function queryServicesCountByOwnerId(api, accoutId){
    return await api.query.services.servicesCountByOwner(accoutId)
}