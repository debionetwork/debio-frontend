/* eslint-disable */
import Kilt from '@kiltprotocol/sdk-js'

onmessage = function(e) {
  console.log("Decrypting...")
  (async () => {
    const decryptedObject = await Kilt.Utils.Crypto.decryptAsymmetric(e.data.text, e.data.pair.secretKey, e.data.pair.publicKey)
    postMessage(decryptedObject)
  })()
    .then(() => {
      console.log("Decrypted");
    })
    .catch(console.log)

}
