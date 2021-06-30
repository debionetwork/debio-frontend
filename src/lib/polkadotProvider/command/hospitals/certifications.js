import { hospitalCommandCallback } from '@/lib/polkadotProvider/command/hospitals'

export async function createCertification(api, pair, data) {
  await api.tx.hospitalCertifications
    .createCertification(data)
    .signAndSend(pair, { nonce: -1 }, async ({ status, events }) => {
      await hospitalCommandCallback(api, pair, { status, events }) 
    })
}

export async function updateCertification(api, pair, certificationId, data) {
  await api.tx.hospitalCertifications
    .updateCertification(certificationId, data)
    .signAndSend(pair, { nonce: -1 }, async ({ status, events }) => {
      await hospitalCommandCallback(api, pair, { status, events }) 
    })
}

export async function deleteCertification(api, pair, certificationId) {
  await api.tx.hospitalCertifications
    .deleteCertification(certificationId)
    .signAndSend(pair, { nonce: -1 }, async ({ status, events }) => {
      await hospitalCommandCallback(api, pair, { status, events }) 
    })
}
