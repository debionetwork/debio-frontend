export async function processDnaSample(api, pair, trackingId, processStatus, callback = () => {}) {
  const unsub = await api.tx.geneticTesting
    .processDnaSample(trackingId, processStatus)
    .signAndSend(pair, { nonce: -1 }, ({ events, status }) => 
      successCallback(api, { events, status, callback, unsub })
    )
}

export async function processDnaSampleFee(api, pair, trackingId, processStatus) {
  const result = await api.tx.geneticTesting
    .processDnaSample(trackingId, processStatus)
    .paymentInfo(pair)
  return result
}

export async function receiveDnaSample(api, pair, trackingId, callback = () => {}) {
  const unsub = await api.tx.geneticTesting
    .receiveDnaSample(trackingId)
    .signAndSend(pair, { nonce: -1 }, ({ events, status }) => 
      successCallback(api, { events, status, callback, unsub })
    )
}

export async function receiveDnaSampleFee(api, pair, trackingId) {
  const result = await api.tx.geneticTesting
    .receiveDnaSample(trackingId)
    .paymentInfo(pair)
  return result
}

export async function rejectDnaSample(api, pair, data, callback = () => {}) {
  const unsub = await api.tx.geneticTesting
    .rejectDnaSample(data.trackingId, data.rejected_title, data.rejected_description)
    .signAndSend(pair, { nonce: -1 }, ({ events, status }) => 
      successCallback(api, { events, status, callback, unsub })
    )
}

export async function rejectDnaSampleFee(api, pair, data) {
  const result = await api.tx.geneticTesting
    .rejectDnaSample(data.trackingId, data.rejected_title, data.rejected_description)
    .paymentInfo(pair)
  return result
}

export async function submitIndependentTestResult(api, pair, submission, callback = () => {}) {
  const unsub = await api.tx.geneticTesting
    .submitIndependentTestResult(submission)
    .signAndSend(pair, { nonce: -1 }, ({ events, status }) => 
      successCallback(api, { events, status, callback, unsub })
    )
}

export async function submitIndependentTestResultFee(api, pair, submission) {
  const result = await api.tx.geneticTesting
    .submitIndependentTestResult(submission)
    .paymentInfo(pair)
  return result
}

export async function submitTestResult(api, pair, trackingId, submission, callback = () => {}) {
  const unsub = await api.tx.geneticTesting
    .submitTestResult(trackingId, submission)
    .signAndSend(pair, { nonce: -1 }, ({ events, status }) => 
      successCallback(api, { events, status, callback, unsub })
    )
}

export async function submitTestResultFee(api, pair, trackingId, submission) {
  const result = await api.tx.geneticTesting
    .submitTestResult(trackingId, submission)
    .paymentInfo(pair)
  return result
}

function successCallback(api, { events, status, callback, unsub }){
  if (status.isFinalized) {
    // find/filter for success events
    const eventList = events.filter(({ event }) =>
      api.events.system.ExtrinsicSuccess.is(event)
    )
    if(eventList.length > 0){
      callback()
      unsub()
    }
  }
}
