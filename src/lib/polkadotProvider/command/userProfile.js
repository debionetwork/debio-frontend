export async function setUsdtAddress(api, pair, data){
    const result = await api.tx.userProfile
        .setUsdtAddress(data)
        .signAndSend(pair)
    return result.toHuman()
}