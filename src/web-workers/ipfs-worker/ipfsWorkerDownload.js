/* eslint-disable */
import ipfsClient from 'ipfs-http-client';
import IPFSHttpClient from 'ipfs-http-client';

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
    let arrHash = e.data.sort(sortingFile);
    let dts;
    for( const hash of arrHash) {
      console.log("downloading:", hash.data.path);
      const res = await ipfs.get("/ipfs/"+hash.data.path);
      const content = await res.next();
      let dt = await content.value.content.next();
      if (!dts) {
        dts = dt.value;
      } else {
        dts = constructFile(dts, dt.value);
      }
      for await (let dtd of content.value.content) {
        dts = constructFile(dts, dtd);
      }
    }

    return dts;
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
