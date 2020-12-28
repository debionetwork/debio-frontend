import EthCrypto from 'eth-crypto';

onmessage = function(e) {
  console.log("Encrypting...");
  EthCrypto.encryptWithPublicKey(e.data.publicKey, e.data.text)
  .then(encryptedObj => {
    console.log("Encrypted");
    console.log(this.encryptedObj);
    postMessage(encryptedObj);
  });

}
