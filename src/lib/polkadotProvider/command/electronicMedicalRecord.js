export async function registerElectronicMedicalRecord(api, pair) {
  const result = await api.tx.electronicMedicalRecord
    .addElectronicMedicalRecord()
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}

export async function deregisterElectronicMedicalRecord(api, pair) {
  const result = await api.tx.electronicMedicalRecord
    .removeElectronicMedicalRecord()
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}

export async function addElectronicMedicalRecordInfo(api, pair, data) {
  const result = await api.tx.electronicMedicalRecord
    .addElectronicMedicalRecordInfo(data)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}

export async function removeElectronicMedicalRecordInfo(api, pair) {
  const result = await api.tx.electronicMedicalRecord
    .removeElectronicMedicalRecordInfo()
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}

export async function uploadElectronicMedicalRecord(api, pair, data) {
  const result = await api.tx.electronicMedicalRecord
    .uploadElectronicMedicalRecord(data)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman();
}