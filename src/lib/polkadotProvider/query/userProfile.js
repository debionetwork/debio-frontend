export async function usdtAddresses(api, address) {
    const res = await api.query.userProfile.usdtAddresses(address)
    return res.toHuman()
}