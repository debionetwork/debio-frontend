/* eslint-disable */
import Kilt from '@kiltprotocol/sdk-js'

onmessage = function(e) {
  console.log("Decrypting...")
  (async () => {
    const decryptedObject = await Kilt.Utils.Crypto.decryptAsymmetric(e.data.text, e.data.pair.publicKey, e.data.pair.secretKey)
    postMessage(decryptedObject)
  })()
    .then(() => {
      console.log("Decrypted");
    })
    .catch(console.log)

}
