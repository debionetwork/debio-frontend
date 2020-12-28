import EthCrypto from 'eth-crypto';

onmessage = function(e) {
  console.log("Encrypting...");
  EthCrypto.decryptWithPrivateKey(e.data.publicKey, e.data.text)
  .then(decryptedObject => {
    console.log("Encrypted");
    console.log(this.decryptedObject);
    postMessage(decryptedObject);
  });

}
