export async function setEthAddress(api, pair, data) {
    const result = await api.tx.userProfile
        .setEthAddress(data)
        .signAndSend(pair)
    return result.toHuman()
}


