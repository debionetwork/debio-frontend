export async function processDnaSample(api, pair, tracking_id) {
  const result = await api.tx.geneticTesting
    .processDnaSample(tracking_id)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}

export async function receiveDnaSample(api, pair, tracking_id) {
  const result = await api.tx.geneticTesting
    .receiveDnaSample(tracking_id)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}

export async function rejectDnaSample(api, pair, data) {
  const result = await api.tx.geneticTesting
    .rejectDnaSample(data.tracking_id, data.rejected_title, data.rejected_description)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}

export async function submitIndependentTestResult(api, pair, submission) {
  const result = await api.tx.geneticTesting
    .submitIndependentTestResult(submission)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}

export async function submitTestResult(api, pair, tracking_id, is_success, submission) {
  const result = await api.tx.geneticTesting
    .submitTestResult(tracking_id, is_success, submission)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}