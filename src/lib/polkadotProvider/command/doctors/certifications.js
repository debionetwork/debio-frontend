import { doctorCommandCallback } from '@/lib/polkadotProvider/command/doctors'

export async function createCertification(api, pair, data) {
  await api.tx.doctorCertifications
    .createCertification(data)
    .signAndSend(pair, { nonce: -1, callback: async (res) => {
      await doctorCommandCallback(api, pair, res) 
    }})
}

export async function updateCertification(api, pair, certificationId, data) {
  await api.tx.doctorCertifications
    .updateCertification(certificationId, data)
    .signAndSend(pair, { nonce: -1, callback: async (res) => {
      await doctorCommandCallback(api, pair, res) 
    }})
}

export async function deleteCertification(api, pair, certificationId) {
  await api.tx.doctorCertifications
    .deleteCertification(certificationId)
    .signAndSend(pair, { nonce: -1, callback: async (res) => {
      await doctorCommandCallback(api, pair, res) 
    }})
}
