export async function createCertification(api, pair, data) {
  const result = await api.tx.certifications
    .createCertification(data)
    .signAndSend(pair, { nonce: -1 })

  return result.toHuman()
}

export async function updateCertification(api, pair, certificationId, data) {
  const res = await api.tx.certifications
    .updateCertification(certificationId, data)
    .signAndSend(pair, { nonce: -1 })

  return res
}

export async function deleteCertification(api, pair, certificationId) {
  const result = await api.tx.certifications
    .deleteCertification(certificationId)
    .signAndSend(pair, { nonce: -1 })

  return result.toHuman()
}
