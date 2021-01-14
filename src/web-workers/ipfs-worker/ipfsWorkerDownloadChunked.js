 /* eslint-disable */
import ipfsClient from 'ipfs-http-client';
import IPFSHttpClient from 'ipfs-http-client';
import EthCrypto from 'eth-crypto';


const sortingFile = ( a, b ) => {
  if ( a.seed < b.seed ){
    return -1;
  }
  if ( a.seed > b.seed ){
    return 1;
  }
  return 0;
}
onmessage = function(e) {
  console.log("Downloading...");

  const ipfs = IPFSHttpClient({host: 'ipfs.infura.io', port: 5001, protocol: 'https'});
  // const ipfs = IPFSHttpClient({host: 'localhost', port: 5001, protocol: 'http'});
  (async (ipfs)=>{
    let arrHash = e.data.file.sort(sortingFile);
    let dts;
    let objs =  "";
    for( const hash of arrHash) {
      console.log(hash);
      const res = await ipfs.get("/ipfs/"+hash.data.path);
      const content = await res.next();
      let dt = await content.value.content.next();
      if (!dts) {
        dts = dt.value;
      }
      for await (let dtd of content.value.content) {
        dts = constructFile(dts, dtd);
      }

      const fl = new Blob([ dts ], {type: 'text/plain'});
      const encrypted = await fl.text();
      const decryptedObject = await EthCrypto.decryptWithPrivateKey(e.data.privateKey, JSON.parse(encrypted).data);
      if (!decryptedObject) {
        console.log('undefined', decryptedObject, hash.seed);
      }
      if(decryptedObject) {
        objs += decryptedObject;
      }
      dts = null;
    }
    return objs;
  })(ipfs).then(res=>{
    postMessage(res);
  });
}

function constructFile(chunk1, chunk2) {
  var tmp = new Uint8Array(chunk1.length + chunk2.length);
  tmp.set(chunk1);
  tmp.set(chunk2, chunk1.length);
  return tmp;
}
