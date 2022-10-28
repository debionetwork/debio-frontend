/* eslint-disable */
export async function queryBalance(api, addr) {
  const { nonce, data: balance } = await api.query.system.account(
    addr
  );
  const chainDecimal = api.registry.chainDecimals;
  return Number(balance.free.toBigInt()) / Math.pow(10, chainDecimal[0]);
}