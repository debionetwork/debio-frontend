export async function setEthAddress(api, pair, data, callback = () => {}) {
  const unsub = await api.tx.userProfile
    .setEthAddress(data)
    .signAndSend(pair, { nonce: -1 }, async ({ events = [], status }) => {
      await userProfileCallback(api, { events, status, callback, unsub })
    })
}

async function userProfileCallback(api, { events, status, callback, unsub }){
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
