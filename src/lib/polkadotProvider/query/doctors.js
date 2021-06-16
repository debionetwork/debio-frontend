export async function queryDoctorsById(api, doctorId){
    const res = await api.query.doctors.doctors(doctorId)
    return res.toHuman()
}

export async function queryDoctorsByCountryRegionCity(api, countryRegion, city){
    const res = await api.query.doctors.doctorsByCountryRegionCity(countryRegion, city)
    return res.toHuman()
}

export async function queryDoctorCount(api){
    return await api.query.doctors.doctorCount()
}

export async function queryDoctorsCountByCountryRegionCity(api, countryRegion, city){
    const res = await api.query.doctors.doctorCountByCountryRegionCity(countryRegion, city)
    return res.toHuman()
}