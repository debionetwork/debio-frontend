export async function processDnaSample(api, pair, trackingId, process_status, callback = ()=>{}) {
  const unsub = await api.tx.geneticTesting
    .processDnaSample(trackingId, process_status)
    .signAndSend(pair, { nonce: -1 }, ({ events, status }) => 
      successCallback(api, { events, status, callback, unsub })
    )
}

export async function receiveDnaSample(api, pair, trackingId, callback = ()=>{}) {
  const unsub = await api.tx.geneticTesting
    .receiveDnaSample(trackingId)
    .signAndSend(pair, { nonce: -1 }, ({ events, status }) => 
      successCallback(api, { events, status, callback, unsub })
    )
}

export async function rejectDnaSample(api, pair, data, callback = ()=>{}) {
  const unsub = await api.tx.geneticTesting
    .rejectDnaSample(data.trackingId, data.rejected_title, data.rejected_description)
    .signAndSend(pair, { nonce: -1 }, ({ events, status }) => 
      successCallback(api, { events, status, callback, unsub })
    )
}

export async function submitIndependentTestResult(api, pair, submission, callback = ()=>{}) {
  const unsub = await api.tx.geneticTesting
    .submitIndependentTestResult(submission)
    .signAndSend(pair, { nonce: -1 }, ({ events, status }) => 
      successCallback(api, { events, status, callback, unsub })
    )
}

export async function submitTestResult(api, pair, trackingId, submission, callback = ()=>{}) {
  const unsub = await api.tx.geneticTesting
    .submitTestResult(trackingId, submission)
    .signAndSend(pair, { nonce: -1 }, ({ events, status }) => 
      successCallback(api, { events, status, callback, unsub })
    )
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