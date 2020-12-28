

const workerUpload = new Worker('./ipfsWorker', { type: 'module' });
const workerDownload = new Worker('./ipfsWorkerDownload', { type: 'module' });

export default { workerUpload, workerDownload };

// const send = message => worker.postMessage({
  // message
// })

// export default {
  // worker,
  // send
// }

