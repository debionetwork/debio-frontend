
import IPFSHttpClient from 'ipfs-http-client';
onmessage = function(e) {
  const ipfs = IPFSHttpClient({host: 'ipfs.infura.io', port: 5001, protocol: 'https'});
  console.log("download running", e.data);
  const res = ipfs.get("/ipfs/"+e.data);

    res.next()
    .then(ss => {
      postMessage(ss.value.content);
    });

}
