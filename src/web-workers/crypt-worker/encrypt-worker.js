 /* eslint-disable */
import EthCrypto from 'eth-crypto';

onmessage = function(e) {
  console.log("Encrypting...");
  console.log(e);

  (async (EthCrypto)=>{
    const fileBlob = new Blob([ e.data.text ], {type: 'text/plain'});
    const chunkSize = 5 * 1000 * 1024;
    const chunksAmount = Math.ceil(fileBlob.size / chunkSize);
    postMessage({chunksAmount})

    for (let i = 0; i < chunksAmount; i += 1) {
      const start = chunkSize * i;
      const end = chunkSize * (i + 1);
      const chunk = fileBlob.slice(start, end, fileBlob.type);
      const chunkBuf = await chunk.arrayBuffer();
      const data = await EthCrypto.encryptWithPublicKey(e.data.publicKey, chunkBuf);
      postMessage({ seed: i,  data });
      console.log({ seed: i,  data });

      // postMessage({ seed: i,  data: chunk });
    }
  })(EthCrypto).then(res=>{
    console.log("Encrypted");
  }).catch(console.log)

}
