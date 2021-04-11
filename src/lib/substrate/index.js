import { ApiPromise, WsProvider } from '@polkadot/api'
import types from './types.json'

export { default as Wallet } from './wallet'

export async function connect() {
  try {
    const PROVIDER_SOCKET = 'wss://debio.theapps.dev/node'
    const wsProvider = new WsProvider(PROVIDER_SOCKET)
    const api = await ApiPromise.create({
      provider: wsProvider,
      types: types
    })
    await api.isReady
    return api

  } catch (err) {
    throw new Error(err)
  }
}
