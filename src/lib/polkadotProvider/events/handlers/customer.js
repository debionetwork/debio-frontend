import { queryBalance } from "@/lib/polkadotProvider/query/balance"
import store from '@/store/index'

const defaultHandler = {
    get: function(target, name){
        return Object.prototype.hasOwnProperty.call(target, name) ? target[name] : (dataEvent, value, valueMessage) => {
            const data = dataEvent[0]
            const id = data[value]
            const params = { number: id }
            const wording = "for (" + data[valueMessage].substr(0, 4) + "..." + data[valueMessage].substr(data[valueMessage].length - 4) + ")"
            return { data, id, params, wording }
        }
    }
}

const handler = {
    orders: (dataEvent, value, valueMessage) => {
        const data = dataEvent[0]
        const id = data[value]
        const params = { number: id }
        const wording = "for (" + data[valueMessage].substr(0, 4) + "..." + data[valueMessage].substr(data[valueMessage].length - 4) + ")"
        return { data, id, params, wording }
    },
    geneticTesting: (dataEvent, value, valueMessage) => {
        const data = dataEvent[0]
        const id = data[value]
        const params = { number: id }
        const wording = "for (" + data[valueMessage].substr(0, 4) + "..." + data[valueMessage].substr(data[valueMessage].length - 4) + ")"
        return { data, id, params, wording }
    },
    balances: async (dataEvent, value, valueMessage) => {
        const data = dataEvent
        const id = data[value]
        const params = { number: id }
        let finalText = ""

        if (data[valueMessage].toString().includes("0x")) {
          const decimal = parseInt(data[valueMessage].toString(), 16).toString()
          finalText = decimal.replace("000000000000000", "")
        } else {
          finalText = data[valueMessage].toString().replace("000000000000000", "")
        }
        if (finalText != "") {
          const balance = await queryBalance(
            store.getters['substrate/getAPI'],
            store.getters['substrate/wallet'].address
          )
          store.state.substrate.walletBalance = balance
        }
        const wording = finalText + " DBIO!"
        return { data, id, params, wording }
    },
}

// If property not found, return defaultHandler
export const customerHandler = new Proxy(handler, defaultHandler)