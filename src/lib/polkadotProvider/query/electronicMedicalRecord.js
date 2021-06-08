export async function queryElectricMedicalRecordByOwnerId(api, ownerId){
    const res = await api.query.electronicMedicalRecord.electricMedicalRecordByOwnerId(ownerId)
    return res.toHuman()
}

export async function queryElectronicMedicalRecordInfoById(api, emrId){
    const res = await api.query.electronicMedicalRecord.electronicMedicalRecordInfoById(emrId)
    return res.toHuman()
}

export async function queryElectronicMedicalRecordInfoCount(api){
    const res = await api.query.electronicMedicalRecord.electronicMedicalRecordInfoCount()
    return res.toHuman()
}

export async function queryElectronicMedicalRecordInfoCountByOwner(api, ownerId){
    const res = await api.query.electronicMedicalRecord.electronicMedicalRecordInfoCountByOwner(ownerId)
    return res.toHuman()
}