import { doctorCommandCallback } from '@/lib/polkadotProvider/command/doctors'

export async function createCertification(api, pair, data) {
  await api.tx.doctorCertifications
    .createCertification(data)
    .signAndSend(pair, { nonce: -1 }, async ({ status, events }) => {
      await doctorCommandCallback(api, pair, { status, events }) 
    })
}

export async function updateCertification(api, pair, certificationId, data) {
  await api.tx.doctorCertifications
    .updateCertification(certificationId, data)
    .signAndSend(pair, { nonce: -1 }, async ({ status, events }) => {
      await doctorCommandCallback(api, pair, { status, events }) 
    })
}

export async function deleteCertification(api, pair, certificationId) {
  await api.tx.doctorCertifications
    .deleteCertification(certificationId)
    .signAndSend(pair, { nonce: -1 }, async ({ status, events }) => {
      await doctorCommandCallback(api, pair, { status, events }) 
    })
}
