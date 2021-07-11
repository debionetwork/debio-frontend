import { getHospitalCertificationDetail } from '@/lib/polkadotProvider/query/hospitals/certifications'

export async function queryHospitalsById(api, hospitalId){
    const res = await api.query.hospitals.hospitals(hospitalId)
    return res.toHuman()
}

export async function queryHospitalsByCountryRegionCity(api, countryRegion, city){
    const res = await api.query.hospitals.hospitalsByCountryRegionCity(countryRegion, city)
    return res.toHuman()
}

export async function queryHospitalCount(api){
    return await api.query.hospitals.hospitalCount()
}

export async function queryHospitalsCountByCountryRegionCity(api, countryRegion, city){
    const res = await api.query.hospitals.hospitalCountByCountryRegionCity(countryRegion, city)
    return res.toHuman()
}

export async function queryEntireHospitalDataById(api, hospitalId){
    const res = (await api.query.hospitals.hospitals(hospitalId)).toHuman()

    // if null return
    if(!res) return res

    // If not null continue
    const certificationsDetailedList = []
    for(let i = 0; i < res.certifications.length; i++){
        let certificationDetail = await getHospitalCertificationDetail(api, res.certifications[i])
        certificationsDetailedList.push(certificationDetail)
    }
    res.certifications = certificationsDetailedList
    return res
}