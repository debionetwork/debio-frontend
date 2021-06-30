const workerEncrypt = new Worker(
  './encrypt-worker',
  { type: 'module', name: 'encrypt-worker' }
);
const workerDecrypt = new Worker(
  './decrypt-worker',
  { type: 'module', name: 'decrypt-worker' }
);
const workerEncryptFile = new Worker(
  './encrypt-worker-file',
  { type: 'module', name: 'encrypt-worker-file' }
);

export default { workerEncrypt, workerDecrypt, workerEncryptFile };