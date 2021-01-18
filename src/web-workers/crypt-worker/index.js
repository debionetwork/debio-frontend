const workerEncrypt = new Worker(
  './encrypt-worker',
  { type: 'module', name: 'encrypt-worker' }
);
const workerDecrypt = new Worker(
  './decrypt-worker',
  { type: 'module', name: 'decrypt-worker' }
);

export default { workerEncrypt, workerDecrypt };