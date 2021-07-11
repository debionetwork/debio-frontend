import { queryEntireHospitalDataById } from '@/lib/polkadotProvider/query/hospitals'
import store from '@/store/index'

export async function registerHospital(api, pair, data, callback = () => {}){
    const unsub = await api.tx.hospitals
        .registerHospital(data)
        .signAndSend(pair, { nonce: -1 }, async ({ events = [], status }) => {
            await hospitalCommandCallback(api, pair, { events, status, callback, unsub })
        })
}

export async function updateHospital(api, pair, data, callback = () => {}){
    const unsub = await api.tx.hospitals
        .updateHospital(data)
        .signAndSend(pair, { nonce: -1 }, async ({ events = [], status }) => {
            await hospitalCommandCallback(api, pair, { events, status, callback, unsub })
        })
}

export async function deregisterHospital(api, pair){
    const result = await api.tx.hospitals
        .deregisterHospital()
        .signAndSend(pair, { nonce: -1 })
    return result.toHuman()
}

export async function hospitalCommandCallback(api, pair, { events, status, callback, unsub }){
    if (status.isFinalized) {
        // find/filter for success events
        const eventList = events.filter(({ event }) =>
            api.events.system.ExtrinsicSuccess.is(event)
        )
        if(eventList.length > 0){
            store.state.substrate.hospitalAccount = await queryEntireHospitalDataById(api, pair.address)
            callback()
            unsub()
        }
    }
}