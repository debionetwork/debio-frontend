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