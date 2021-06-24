/* eslint-disable */
export async function queryBalance(api, addr) {
  const { nonce, data: balance } = await api.query.system.account(
    addr
  );
  return balance.free.toHuman();
}