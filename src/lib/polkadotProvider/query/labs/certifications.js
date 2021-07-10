
export async function getCertificationDetail(api, certificationId){
  const res = await api.query.certifications.certifications(certificationId)
  return res.toHuman()
}
