import ipfsWorker from "@/web-workers/ipfs-worker";

export async function downloadDecryptedFromIPFS(path, secretKey, publicKey, fileName, type) {
  const channel = new MessageChannel();
  channel.port1.onmessage = ipfsWorker.workerDownload;
  const pair = {
    secretKey,
    publicKey,
  };

  const typeFile = type;
  ipfsWorker.workerDownload.postMessage({ path, pair, typeFile }, [channel.port2]);
  ipfsWorker.workerDownload.onmessage = (event) => {
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
}