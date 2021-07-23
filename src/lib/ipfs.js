import ipfsWorker from "@/web-workers/ipfs-worker"
import store from '@/store/index'

export function upload({ fileChunk, fileName, fileType }) {
  const chunkSize = 10 * 1024 * 1024 // 10 MB
  let offset = 0
  const blob = new Blob([ fileChunk ], { type: fileType })

  return new Promise((resolve, reject) => {
      try {
      const fileSize = blob.size
      do {
          let chunk = blob.slice(offset, chunkSize + offset);
          ipfsWorker.workerUpload.postMessage({
          seed: chunk.seed, file: blob
          })
          offset += chunkSize
      } while((chunkSize + offset) < fileSize)
      
      let uploadSize = 0
      const uploadedResultChunks = []
      ipfsWorker.workerUpload.onmessage = async event => {
          uploadedResultChunks.push(event.data)
          uploadSize += event.data.data.size
          
          if (uploadSize >= fileSize) {
          resolve({
              fileName: fileName,
              fileType: fileType,
              ipfsPath: uploadedResultChunks
          })
          }
      }

      } catch (err) {
      reject(new Error(err.message))
      }
  })
}

export async function downloadDecryptedFromIPFS(path, secretKey, publicKey, fileName, type) {
  store.state.auth.loadingData = {
    loading: true,
    loadingText: "Decrypt File",
  };
  const channel = new MessageChannel();
  channel.port1.onmessage = ipfsWorker.workerDownload;
  const pair = {
    secretKey,
    publicKey,
  };

  const typeFile = type;
  ipfsWorker.workerDownload.postMessage({ path, pair, typeFile }, [channel.port2]);
  ipfsWorker.workerDownload.onmessage = (event) => {
    store.state.auth.loadingData = {
      loading: true,
      loadingText: "Downloading File",
    };
    if (type == "application/pdf") {
      downloadPDF(event.data, fileName);
    } else {
      download(event.data, fileName);
    }
    //this.$set(this.filesLoading, this.fileDownloadIndex, false);
  };
}

export async function download(data, fileName) {
  const blob = new Blob([data], { type: "text/plain" });
  const e = document.createEvent("MouseEvents");
  const a = document.createElement("a");
  a.download = fileName;
  a.href = window.URL.createObjectURL(blob);
  a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
  e.initEvent(
    "click",
    true,
    false,
    window,
    0,
    0,
    0,
    0,
    0,
    false,
    false,
    false,
    false,
    0,
    null
  );
  a.dispatchEvent(e);
  store.state.auth.loadingData = {
    loading: false,
    loadingText: "Downloaded File",
  };
}

export async function downloadPDF(data, fileName) {
  const blob = new Blob([data], { type: "application/pdf" });
  const e = document.createEvent("MouseEvents");
  const a = document.createElement("a");
  a.download = fileName;
  a.href = window.URL.createObjectURL(blob);
  a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
  e.initEvent(
    "click",
    true,
    false,
    window,
    0,
    0,
    0,
    0,
    0,
    false,
    false,
    false,
    false,
    0,
    null
  );
  a.dispatchEvent(e);
  store.state.auth.loadingData = {
    loading: false,
    loadingText: "Downloaded File",
  };
}
