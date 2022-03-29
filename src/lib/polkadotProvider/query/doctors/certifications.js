export async function getDoctorCertificationDetail(api, doctorCertificationId){
  const res = await api.query.doctorCertifications.doctorCertifications(doctorCertificationId)
  return res.toHuman()
}
