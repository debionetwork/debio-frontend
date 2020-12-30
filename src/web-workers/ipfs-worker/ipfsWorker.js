 /* eslint-disable */
import IPFSHttpClient from 'ipfs-http-client';

onmessage = function(e) {
  const ipfs = IPFSHttpClient({host: 'ipfs.infura.io', port: 5001, protocol: 'https'});
  console.log("IPFS Uploader Start");
  (async (ipfs)=>{
    const fileBlob = e.data;
    const chunkSize = 99 * 1000 * 1024;
    const chunksAmount = Math.ceil(fileBlob.size / chunkSize);
    postMessage({chunksAmount})
    for (let i = 0; i < chunksAmount; i += 1) {
        const start = chunkSize * i;
        const end = chunkSize * (i + 1);
        const chunk = fileBlob.slice(start, end, fileBlob.type);
        const data = await ipfs.add(chunk);
        postMessage({ seed: i,  data });
        // postMessage({ seed: i,  data: chunk });
    }
  })(ipfs).then(res=>{
    console.log("IPFS Uploader finish");
  }).catch(console.log);


};
