export async function queryBalance(api, addr) {
  const { nonce, data: balance } = await api.query.system.account(
    addr
  );
  console.log(nonce);
  return balance.free.toHuman();
}