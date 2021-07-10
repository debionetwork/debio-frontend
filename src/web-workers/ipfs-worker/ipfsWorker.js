 /* eslint-disable */
import IPFSHttpClient from 'ipfs-http-client';

onmessage = function(e) {
  const ipfs = IPFSHttpClient({host: 'ipfs.infura.io', port: 5001, protocol: 'https'});
  console.log("IPFS Uploader Start");
  (async (ipfs)=>{
    const data = await ipfs.add(e.data.file);
    postMessage({seed: e.data.seed, data});
  })(ipfs).then(res=>{
    console.log("IPFS Uploader finish");
  }).catch(console.log);
};
