import { getDoctorCertificationDetail } from '@/lib/polkadotProvider/query/doctors/certifications'

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

export async function queryEntireDoctorDataById(api, doctorId){
    const res = (await api.query.doctors.doctors(doctorId)).toHuman()

    // if null return
    if(!res) return res

    // If not null continue
    const certificationsDetailedList = []
    for(let i = 0; i < res.certifications.length; i++){
        let certificationDetail = await getDoctorCertificationDetail(api, res.certifications[i])
        certificationsDetailedList.push(certificationDetail)
    }
    res.certifications = certificationsDetailedList
    return res
}