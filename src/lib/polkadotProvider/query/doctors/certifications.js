export async function getDoctorCertificationDetails(api, doctorCertificationIds) {
    const certs = []
    for (let i = 0; i < doctorCertificationIds.length; i++) {
      const res = await api.query.doctorCertifications.doctorCertifications(doctorCertificationIds[i])
      if (res.isSome) {
        certs.push(res.toHuman())
      }
    }
  
    return certs
  }
  