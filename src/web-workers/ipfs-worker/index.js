

const workerUpload = new Worker('./ipfsWorker', { type: 'module' });
const workerDownload = new Worker('./ipfsWorkerDownloadChunked', { type: 'module' });

export default { workerUpload, workerDownload };
