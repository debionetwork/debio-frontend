import { hospitalCommandCallback } from '@/lib/polkadotProvider/command/hospitals'

export async function createCertification(api, pair, data, callback = () => {}) {
  const unsub = await api.tx.hospitalCertifications
    .createCertification(data)
    .signAndSend(pair, { nonce: -1 }, async ({ events = [], status }) => {
      await hospitalCommandCallback(api, pair, { events, status, callback, unsub })
    })
}

export async function updateCertification(api, pair, certificationId, data, callback = () => {}) {
  const unsub = await api.tx.hospitalCertifications
    .updateCertification(certificationId, data)
    .signAndSend(pair, { nonce: -1 }, async ({ events = [], status }) => {
      await hospitalCommandCallback(api, pair, { events, status, callback, unsub })
    })
}

export async function deleteCertification(api, pair, certificationId, callback = () => {}) {
  const unsub = await api.tx.hospitalCertifications
    .deleteCertification(certificationId)
    .signAndSend(pair, { nonce: -1 }, async ({ events = [], status }) => {
      await hospitalCommandCallback(api, pair, { events, status, callback, unsub })
    })
}
