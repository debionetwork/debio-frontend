import { queryEntireLabDataById } from '@/lib/polkadotProvider/query/labs'
import store from '@/store/index'

export async function registerLab(api, pair, data, callback = () => {}){
    const unsub = await api.tx.labs
        .registerLab(data)
        .signAndSend(pair, { nonce: -1 }, async ({ events = [], status }) => {
            await labCommandCallback(api, pair, { events, status, callback, unsub })
        })
}

export async function updateLab(api, pair, data, callback = () => {}){
    const unsub = await api.tx.labs
        .updateLab(data)
        .signAndSend(pair, { nonce: -1 }, async ({ events = [], status }) => {
            await labCommandCallback(api, pair, { events, status, callback, unsub })
        })
}

export async function deregisterLab(api, pair){
    const result = await api.tx.labs
        .deregisterLab()
        .signAndSend(pair, { nonce: -1 })
    return result.toHuman()
}

export async function labCommandCallback(api, pair, { events, status, callback, unsub }){
    if (status.isFinalized) {
        // find/filter for success events
        const eventList = events.filter(({ event }) =>
            api.events.system.ExtrinsicSuccess.is(event)
        )
        if(eventList.length > 0){
            store.state.substrate.labAccount = await queryEntireLabDataById(api, pair.address)
            callback()
            unsub()
        }
    }
}