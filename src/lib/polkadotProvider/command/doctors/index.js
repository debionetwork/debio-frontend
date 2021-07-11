import { queryEntireDoctorDataById } from '@/lib/polkadotProvider/query/doctors'
import store from '@/store/index'

export async function registerDoctor(api, pair, data, callback = () => {}){
    const unsub = await api.tx.doctors
        .registerDoctor(data)
        .signAndSend(pair, { nonce: -1 }, async ({ events = [], status }) => {
            await doctorCommandCallback(api, pair, { events, status, callback, unsub })
        })
}

export async function updateDoctor(api, pair, data, callback = () => {}){
    const unsub = await api.tx.doctors
        .updateDoctor(data)
        .signAndSend(pair, { nonce: -1 }, async ({ events = [], status }) => {
            await doctorCommandCallback(api, pair, { events, status, callback, unsub })
        })
}

export async function deregisterDoctor(api, pair){
    const result = await api.tx.doctors
        .deregisterDoctor()
        .signAndSend(pair, { nonce: -1 })
    return result.toHuman()
}

export async function doctorCommandCallback(api, pair, { events, status, callback, unsub }){
    if (status.isFinalized) {
        // find/filter for success events
        const eventList = events.filter(({ event }) =>
            api.events.system.ExtrinsicSuccess.is(event)
        )
        if(eventList.length > 0){
            store.state.substrate.doctorAccount = await queryEntireDoctorDataById(api, pair.address)
            callback()
            unsub()
        }
    }
}