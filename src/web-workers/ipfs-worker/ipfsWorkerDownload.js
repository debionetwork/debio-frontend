 /* eslint-disable */
import IPFSHttpClient from 'ipfs-http-client';
onmessage = function(e) {
  console.log("Downloading...");

  const ipfs = IPFSHttpClient({host: 'ipfs.infura.io', port: 5001, protocol: 'https'});
  (async (ipfs)=>{
    const res = await ipfs.get("/ipfs/"+e.data);
    const content = await res.next()
    let dt = await content.value.content.next()
    let dts = dt.value
    console.log(dt);
    for await (let dtd of content.value.content) {
      var tmp = new Int8Array(dts.length + dtd.length);
      tmp.set(dts);
      tmp.set(dtd, dts.length);
      dts = tmp;
    }
    return dts;
  })(ipfs).then(res=>{
    postMessage(res);
  });

}
