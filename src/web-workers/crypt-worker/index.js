
const workerEncrypt = new Worker('./encrypt-worker', { type: 'module' });
const workerDecrypt = new Worker('./decrypt-worker', { type: 'module' });

export default { workerEncrypt, workerDecrypt };