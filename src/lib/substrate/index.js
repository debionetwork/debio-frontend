import { ApiPromise, WsProvider } from '@polkadot/api'
export { default as Wallet } from './Wallet'

export async function connect() {
  try {
    const PROVIDER_SOCKET = 'ws://127.0.0.1:9944'
    const wsProvider = new WsProvider(PROVIDER_SOCKET)
    const api = await ApiPromise.create({ provider: wsProvider })
    await api.isReady
    return api

  } catch (err) {
    throw new Error(err)
  }
}
