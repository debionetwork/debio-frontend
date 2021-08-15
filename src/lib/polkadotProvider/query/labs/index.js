import { queryServicesById } from '@/lib/polkadotProvider/query/services'
import { getCertificationDetail } from '@/lib/polkadotProvider/query/labs/certifications'

export async function queryLabsById(api, labId){
    const res = await api.query.labs.labs(labId)
    return res.toHuman()
}

export async function queryEntireLabDataById(api, labId){
    const res = (await api.query.labs.labs(labId)).toHuman()

    // if null return
    if(!res) return res
    
    // If not null continue
    const servicesDetailedList = []
    for(let i = 0; i < res.services.length; i++){
        try {
            let serviceDetail = await queryServicesById(api, res.services[i])
            servicesDetailedList.push(serviceDetail)
        } catch (err) {
            console.log('lib/polkadotProvider/query/labs error: ', err)
            continue
        }
    }
    res.services = servicesDetailedList

    // If not null continue
    const certificationsDetailedList = []
    for(let i = 0; i < res.certifications.length; i++){
        let certificationDetail = await getCertificationDetail(api, res.certifications[i])
        certificationsDetailedList.push(certificationDetail)
    }
    res.certifications = certificationsDetailedList
    
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