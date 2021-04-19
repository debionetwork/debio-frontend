import { mnemonicGenerate } from '@polkadot/util-crypto'
import { Keyring } from '@polkadot/keyring'
import { ApiPromise, WsProvider } from '@polkadot/api'
import types from '@/types.json'

export function generateAccount() {
    // type: ed25519, ssFormat: 42 (all defaults)
    const keyring = new Keyring()
    const mnemonic = mnemonicGenerate()
    const pair = keyring.addFromUri(mnemonic, 'ed25519')
    return {mnemonic: mnemonic, pair: pair}
}

export async function connectToBlockchain() {
    const wsProvider = new WsProvider('wss://debio.theapps.dev/node')
    return await ApiPromise.create({
        provider: wsProvider,
        types: types
    })
}