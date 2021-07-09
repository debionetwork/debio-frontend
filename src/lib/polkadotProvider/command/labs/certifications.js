import { labCommandCallback } from '@/lib/polkadotProvider/command/labs'

export async function createCertification(api, pair, data, callback = () => {}) {
  const unsub = await api.tx.certifications
    .createCertification(data)
    .signAndSend(pair, { nonce: -1 }, async ({ events, status }) => {
      await labCommandCallback(api, pair, { events, status, callback, unsub }) 
    })
}

export async function updateCertification(api, pair, certificationId, data, callback = () => {}) {
  const unsub = await api.tx.certifications
    .updateCertification(certificationId, data)
    .signAndSend(pair, { nonce: -1 }, async ({ events, status }) => {
      await labCommandCallback(api, pair, { events, status, callback, unsub }) 
    })
}

export async function deleteCertification(api, pair, certificationId, callback = () => {}) {
  const unsub = await api.tx.certifications
    .deleteCertification(certificationId)
    .signAndSend(pair, { nonce: -1 }, async ({ events, status }) => {
      await labCommandCallback(api, pair, { events, status, callback, unsub }) 
    })
}
