export async function getHospitalCertificationDetail(api, hospitalCertificationId){
  const res = await api.query.hospitalCertifications.hospitalCertifications(hospitalCertificationId)
  return res.toHuman()
}
