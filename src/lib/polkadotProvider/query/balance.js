export async function queryBalance(api, addr) {
    return await api.query.system.account(addr)
}