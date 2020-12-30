import EthCrypto from 'eth-crypto';

onmessage = function(e) {
  console.log("Decrypting...", e.data);
  const fl = new Blob([ e.data.text ], {type: 'text/plain'});
  fl.text().then(encrypted => {
    const obj = JSON.parse(encrypted);
    EthCrypto.decryptWithPrivateKey(e.data.privateKey, obj)
    .then(decryptedObject => {
      console.log("Decrypted");
      postMessage(decryptedObject);
    });
  });

}
