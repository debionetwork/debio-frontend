import { labCommandCallback } from '@/lib/polkadotProvider/command/labs'

export async function createCertification(api, pair, data) {
  await api.tx.certifications
    .createCertification(data)
    .signAndSend(pair, { nonce: -1 }, async ({ status, events }) => {
      await labCommandCallback(api, pair, { status, events }) 
    })
}

export async function updateCertification(api, pair, certificationId, data) {
  await api.tx.certifications
    .updateCertification(certificationId, data)
    .signAndSend(pair, { nonce: -1 }, async ({ status, events }) => {
      await labCommandCallback(api, pair, { status, events }) 
    })
}

export async function deleteCertification(api, pair, certificationId) {
  await api.tx.certifications
    .deleteCertification(certificationId)
    .signAndSend(pair, { nonce: -1 }, async ({ status, events }) => {
      await labCommandCallback(api, pair, { status, events }) 
    })
}
