import { queryEntireHospitalDataById } from '@/lib/polkadotProvider/query/hospitals'
import store from '@/store/index'

export async function registerHospital(api, pair, data){
    const result = await api.tx.hospitals
        .registerHospital(data)
        .signAndSend(pair, { nonce: -1 })
    return result.toHuman()
}

export async function updateHospital(api, pair, data){
    await api.tx.hospitals
        .updateHospital(data)
        .signAndSend(pair, { nonce: -1, callback: async (res) => {
            await hospitalCommandCallback(api, pair, res) 
        }})
}

export async function deregisterHospital(api, pair){
    const result = await api.tx.hospitals
        .deregisterHospital()
        .signAndSend(pair, { nonce: -1 })
    return result.toHuman()
}

export async function hospitalCommandCallback(api, pair, {status, events}){
    if (status.isInBlock || status.isFinalized) {
        // find/filter for success events
        const eventList = events.filter(({ event }) =>
            api.events.system.ExtrinsicSuccess.is(event)
        )
        if(eventList.length > 0){
            store.state.substrate.hospitalAccount = await queryEntireHospitalDataById(api, pair.address)
        }
    }
}