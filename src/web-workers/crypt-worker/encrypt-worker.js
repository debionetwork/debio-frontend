/* eslint-disable */
import Kilt from '@kiltprotocol/sdk-js'

onmessage = function(e) {
  console.log("Encrypting...");

  (async () => {
    const fileBlob = new Blob([ e.data.text ], {type: 'text/plain'});
    const chunkSize = 5 * 1000 * 1024; // 5mb chunk size
    const chunksAmount = Math.ceil(fileBlob.size / chunkSize);
    postMessage({chunksAmount})

    for (let i = 0; i < chunksAmount; i += 1) {
      const start = chunkSize * i;
      const end = chunkSize * (i + 1);
      const chunk = fileBlob.slice(start, end, fileBlob.type);
      const chunkBuf = await chunk.arrayBuffer();
      // customerCred -> boxKeyPair.publicKey 0xdf524278e0e2c437bec76ee0d60f50e1acb4abac889dd18d1f528e5494760e56
      // labCred -> boxKeyPair.publicKey 0xe2829ff8b96c52401dc9f89c5ce77df95868b5c9da2b7f70f04be1e9f8c39a74
      const data = await Kilt.Utils.Crypto.encryptAsymmetric(new Uint8Array(chunkBuf), e.data.pair.publicKey, e.data.pair.secretKey);
      console.log('data -> ', data)
      postMessage({ seed: i,  data });
      console.log({ seed: i,  data });

      // postMessage({ seed: i,  data: chunk });
    }
  })()
    .then(() => {
      console.log("Encrypted");
    })
    .catch(console.log)

}
