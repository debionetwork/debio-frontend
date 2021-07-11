import { queryBalance } from "@/lib/polkadotProvider/query/balance"
import store from '@/store/index'

export async function toFormatDebioCoin(valueCoin) {
	let addCoin = "";
	if (valueCoin.toString().includes("0x")) {
		const decimal = parseInt(valueCoin.toString(), 16).toString()
		addCoin = decimal.replace("000000000000000", "")
	} else {
		addCoin = valueCoin.toString().replace("000000000000000", "")
	}
	if (addCoin != "") {
		const balance = await queryBalance(
			store.getters['substrate/getAPI'],
			store.getters['substrate/wallet'].address
		)
		store.state.substrate.walletBalance = balance
	}
}