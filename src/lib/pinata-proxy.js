import Kilt from "@kiltprotocol/sdk-js"
import axios from "axios"
import {
  getIpfsMetaData as pinataIpfsGetIpfsMetadata,
  uploadFile as pinataIpfsUploadFile,
  downloadDocumentFileInBrowser,
  downloadJson
} from "@debionetwork/pinata-ipfs"

const pinataJwtKey = process.env.VUE_APP_PINATA_JWT_KEY

export const uploadFile = val => {
  const options = {
    pinataMetadata: {
      name: val.title,
      keyvalues: {
        type: val.type,
        date: +new Date()
      }
    },
    pinataOptions: { cidVersion: 0 }
  }

  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  return pinataIpfsUploadFile(
    options,
    val.file,
    pinataJwtKey,
    source.token
  )
}

export const getFileUrl = cid => {
  return `https://ipfs.debio.network/ipfs/${cid}`
}

export const downloadFile = async (ipfsLink, withMetaData = false) => {
  console.log("Downloading...")
  const result = await downloadJson(
    ipfsLink,
    withMetaData,
    pinataJwtKey
  )
  console.log("Success Downloaded!")

  return result
}

export const getIpfsMetaData = async (cid) => {
  const metaData = await pinataIpfsGetIpfsMetadata(
    cid,
    pinataJwtKey
  )

  return metaData
}

export const decryptFile = (obj, pair) => {
  const box = Object.values(obj[0].data.box)
  const nonce = Object.values(obj[0].data.nonce)
  let decryptedFile

  const toDecrypt = {
    box: Uint8Array.from(box),
    nonce: Uint8Array.from(nonce)
  }

  decryptedFile = Kilt.Utils.Crypto.decryptAsymmetric(toDecrypt, pair.publicKey, pair.secretKey)

  if (!decryptedFile) console.log("Undefined File", decryptedFile)
  else return decryptedFile
}

export const downloadDocumentFile = (data, fileName, type) => {
  try {
    downloadDocumentFileInBrowser(
      data,
      fileName,
      type
    )
  } catch (error) {
    console.error(error)
  }
}
