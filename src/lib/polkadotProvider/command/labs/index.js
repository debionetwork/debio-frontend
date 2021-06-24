import { queryEntireLabDataById } from '@/lib/polkadotProvider/query/labs'
import store from '@/store/index'

export async function registerLab(api, pair, data){
    const result = await api.tx.labs
        .registerLab(data)
        .signAndSend(pair, { nonce: -1 })
    return result.toHuman()
}

export async function updateLab(api, pair, data){
    await api.tx.labs
        .updateLab(data)
        .signAndSend(pair, { nonce: -1, callback: async (res) => {
            await labCommandCallback(api, pair, res) 
        }})
}

export async function deregisterLab(api, pair){
    const result = await api.tx.labs
        .deregisterLab()
        .signAndSend(pair, { nonce: -1 })
    return result.toHuman()
}

export async function labCommandCallback(api, pair, {status, events}){
    console.log('level 1')
    if (status.isInBlock || status.isFinalized) {
        console.log('level 2')
        // find/filter for success events
        const eventList = events.filter(({ event }) =>
            api.events.system.ExtrinsicSuccess.is(event)
        )
        if(eventList.length > 0){
            console.log('level 3')
            store.state.substrate.labAccount = await queryEntireLabDataById(api, pair.address)
        }
    }
}