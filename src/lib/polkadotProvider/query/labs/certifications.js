export async function getCertificationDetails(api, certificationIds) {
  const certs = []
  for (let i = 0; i < certificationIds.length; i++) {
    const res = await api.query.certifications.certifications(certificationIds[i])
    if (res.isSome) {
      certs.push(res.toHuman())
    }
  }

  return certs
}
