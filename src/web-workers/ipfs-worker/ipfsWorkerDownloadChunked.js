/* eslint-disable */
import IPFSHttpClient from 'ipfs-http-client';
import Kilt from '@kiltprotocol/sdk-js';

onmessage = function (e) {
  console.log("Downloading...");

  const ipfs = IPFSHttpClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
  (async (ipfs) => {
    let dts;
    const res = await ipfs.get("/ipfs/" + e.data.path);
    const content = await res.next();
    let dt = await content.value.content.next();
    if (!dts) {
      dts = dt.value;
    }
    for await (let dtd of content.value.content) {
      dts = constructFile(dts, dtd);
    }

    console.log('dts is -> ', dts)
    const fl = new Blob([dts], { type: e.data.typeFile });
    let encrypted = await fl.text();
    encrypted = JSON.parse(encrypted)
    encrypted = encrypted[0]

    console.log('encrypted', encrypted)
    let { box, nonce } = encrypted.data
    box = Object.values(box) // Convert from object to Array
    nonce = Object.values(nonce) // Convert from object to Array

    const toDecrypt = {
      box: Uint8Array.from(box),
      nonce: Uint8Array.from(nonce)
    }

    if (e.data.typeFile == 'application/pdf') {
      const decryptedObject = await Kilt.Utils.Crypto.decryptAsymmetric(toDecrypt, e.data.pair.publicKey, e.data.pair.secretKey)
      return decryptedObject
    }

    let objs = "";
    const decryptedObject = await Kilt.Utils.Crypto.decryptAsymmetricAsStr(toDecrypt, e.data.pair.publicKey, e.data.pair.secretKey);
    if (!decryptedObject) {
      console.log('undefined', decryptedObject);
    }
    if (decryptedObject) {
      objs += decryptedObject;
    }
    dts = null;
    return objs;
  })(ipfs).then(res => {
    postMessage(res);
  });
}

function constructFile(chunk1, chunk2) {
  var tmp = new Uint8Array(chunk1.length + chunk2.length);
  tmp.set(chunk1);
  tmp.set(chunk2, chunk1.length);
  return tmp;
}
