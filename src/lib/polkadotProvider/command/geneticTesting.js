export async function processDnaSample(api, pair, tracking_id) {
  return await api.tx.geneticTesting
    .processDnaSample(tracking_id)
    .signAndSend(pair)
}

export async function receiveDnaSample(api, pair, tracking_id) {
  return await api.tx.geneticTesting
    .receiveDnaSample(tracking_id)
    .signAndSend(pair)
}

export async function rejectDnaSample(api, pair, tracking_id) {
  return await api.tx.geneticTesting
    .rejectDnaSample(tracking_id)
    .signAndSend(pair)
}

export async function submitIndependentTestResult(api, pair, submission) {
  return await api.tx.geneticTesting
    .submitIndependentTestResult(submission)
    .signAndSend(pair)
}

export async function submitTestResult(api, pair, tracking_id, is_success, submission) {
  return await api.tx.geneticTesting
    .submitTestResult(tracking_id, is_success, submission)
    .signAndSend(pair)
}