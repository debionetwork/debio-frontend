export async function setEthAddress(api, pair, data) {
    const result = await api.tx.userProfile
        .setEthAddress(data)
        .signAndSend(pair, { nonce: -1 })
    return result.toHuman()
}


