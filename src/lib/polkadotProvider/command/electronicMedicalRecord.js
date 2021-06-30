export async function registerElectronicMedicalRecord(api, pair) {
  const result = await api.tx.electronicMedicalRecord
    .addElectronicMedicalRecord()
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}

export async function addElectronicMedicalRecordInfo(api, pair, data) {
  const result = await api.tx.electronicMedicalRecord
    .addElectronicMedicalRecordInfo(data.title, data.description, data.record_link)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}

export async function deregisterElectronicMedicalRecord(api, pair) {
  const result = await api.tx.electronicMedicalRecord
    .removeElectronicMedicalRecord()
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}

export async function removeElectronicMedicalRecordInfo(api, pair, emrId) {
  const result = await api.tx.electronicMedicalRecord
    .removeElectronicMedicalRecordInfo(emrId)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}