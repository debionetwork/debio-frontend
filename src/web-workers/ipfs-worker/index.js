const workerUpload = new Worker(
  './ipfsWorker',
  { type: 'module', name: 'ipfs-upload-worker' }
);
const workerDownload = new Worker(
  './ipfsWorkerDownloadChunked',
  { type: 'module', name: 'ipfs-download-worker' }
);

export default { workerUpload, workerDownload };
