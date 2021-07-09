import { doctorCommandCallback } from '@/lib/polkadotProvider/command/doctors'

export async function createCertification(api, pair, data, callback = () => {}) {
  const unsub = await api.tx.doctorCertifications
    .createCertification(data)
    .signAndSend(pair, { nonce: -1 }, async ({ events = [], status }) => {
      await doctorCommandCallback(api, pair, { events, status, callback, unsub })
    })
}

export async function updateCertification(api, pair, certificationId, data, callback = () => {}) {
  const unsub = await api.tx.doctorCertifications
    .updateCertification(certificationId, data)
    .signAndSend(pair, { nonce: -1 }, async ({ events = [], status }) => {
      await doctorCommandCallback(api, pair, { events, status, callback, unsub })
    })
}

export async function deleteCertification(api, pair, certificationId, callback = () => {}) {
  const unsub = await api.tx.doctorCertifications
    .deleteCertification(certificationId)
    .signAndSend(pair, { nonce: -1 }, async ({ events = [], status }) => {
      await doctorCommandCallback(api, pair, { events, status, callback, unsub })
    })
}
