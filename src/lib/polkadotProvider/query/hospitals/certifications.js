export async function getHospitalCertificationDetails(api, hospitalCertificationIds) {
    const certs = []
    for (let i = 0; i < hospitalCertificationIds.length; i++) {
      const res = await api.query.hospitalCertifications.hospitalCertifications(hospitalCertificationIds[i])
      if (res.isSome) {
        certs.push(res.toHuman())
      }
    }
  
    return certs
  }
  