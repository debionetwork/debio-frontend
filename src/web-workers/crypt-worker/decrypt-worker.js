import EthCrypto from 'eth-crypto';

onmessage = function(e) {
  console.log("Decrypting...", e.data);
  const fl = new Blob([ e.data.text ], {type: 'text/plain'});
  fl.text().then(encrypted => {
    EthCrypto.decryptWithPrivateKey(e.data.privateKey, JSON.parse(encrypted))
    .then(decryptedObject => {
      console.log("Decrypted");
      postMessage(decryptedObject);
    });
  });

}
