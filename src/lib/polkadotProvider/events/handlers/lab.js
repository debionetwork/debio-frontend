import { toFormatDebioCoin } from "@/lib/polkadotProvider/index"
import store from "@/store"


const defaultHandler = {
	get: function (target, name) {
		return Object.prototype.hasOwnProperty.call(target, name) ? target[name] : (dataEvent, value, valueMessage) => {
			const data = dataEvent[0];
			const id = data[value];
			const params = { number: id };
			const wording = "for (" + data[valueMessage].substr(0, 4) + "..." + data[valueMessage].substr(data[valueMessage].length - 4) + ")";
			return { data, id, params, wording }
		}
	}
}

const handler = {
	labs: async (dataEvent, value, valueMessage) => {
		const data = dataEvent;
		const id = data[value];
		const params = { number: id };
		let wording = valueMessage

		if (data[2] == "LabUpdateVerificationStatus") {
			if (data[0].verificationStatus == "Verified") {
				wording = `Congrats! ${wording}`
			}
			wording = `${wording} ${data[0].verificationStatus.toLowerCase()}`
		}
		
		return { data, id, params, wording }
	},
	balances: async (dataEvent, value, valueMessage) => {
    const web3 = store.getters['metamask/getWeb3']
		const data = dataEvent;
		const id = data[value];
		const params = { number: id };
		const finalText = await toFormatDebioCoin(data[valueMessage])
		const wording = web3.utils.fromWei(finalText, 'ether') + " DBIO!"
		return { data, id, params, wording }
	},
	orders: async (dataEvent, value, valueMessage) => {
		const data = dataEvent[0];
		const id = data[value];
		const params = data;
		const wording = "for (" + data[valueMessage].substr(0, 4) + "..." + data[valueMessage].substr(data[valueMessage].length - 4) + ")";
		return { data, id, params, wording }
	},
	rewards: async (dataEvent, value, valueMessage) => {
		const web3 = store.getters['metamask/getWeb3']
		const data = dataEvent;
		const id = data[value];
		const params = null;
		const finalText = await toFormatDebioCoin(data[valueMessage])
		const coin = web3.utils.fromWei(finalText, 'ether')
		const wording = `${coin} DBIO for registering in Debio Appchain`;
		return { data, id, params, wording }
	},
	geneticTesting: async (dataEvent, value, valueMessage) => {
		const data = dataEvent[0];
		const id = data[value];
		const params = { number: id };
		const wording = "for (" + data[valueMessage].substr(0, 4) + "..." + data[valueMessage].substr(data[valueMessage].length - 4) + ")";
		return { data, id, params, wording }
	},
	services: async (dataEvent, value, valueMessage) => {
		const data = dataEvent[0];
		const id = data[value];
		const params = { id: id };
		const wording = valueMessage;
		return { data, id, params, wording }
	},
}

// If property not found, return defaultHandler
export const labHandler = new Proxy(handler, defaultHandler)