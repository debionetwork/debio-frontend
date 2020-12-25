<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="6">
          <v-text-field v-model="publicKeyInput">
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" md="3" sm="4">
          <SquareCardBtn @click="onEncryptUpload">
            <v-icon size="64">mdi-upload-lock</v-icon>
            <div>Encrypt and Upload</div>
            <input type="file" style="display: none" ref="encryptUploadFileInput" />
          </SquareCardBtn>
        </v-col>
      </v-row>
      <v-btn @click="decryptTest">
        Test decrypt
      </v-btn>
    </v-container>
  </div>
</template>

<script>
/**
FIXME: 
This is a WIP for streaming upload and download implementation
*/
import EthCrypto from 'eth-crypto'
import streamSaver from 'streamsaver'
import SquareCardBtn from '../../../components/SquareCardBtn'

export default {
  name: 'Lab',
  components: {
    SquareCardBtn,
  },
  data: () => ({
    publicKeyInput: '',
    encryptedChunkObj: null,
    bufDecoder: null,
    textEncoder: null,
    // To download encrypted file
    fileStream: null,
    writer: null,
    downloadFinished: false,
  }),
  watch: {
    downloadFinished(isFinished) {
      if (isFinished) {
        console.log('download finished')
        setTimeout(() => {
          this.writer.close()
          this.downloadFinished = false
          this.writer = null
          this.fileStream = null
        }, 1000)
      }
    }
  },
  mounted() {
    /*
    * Processing large files using filereader -- reference:
    * https://joji.me/en-us/blog/processing-huge-files-using-filereader-readasarraybuffer-in-web-browser/
    */
    this.bufDecoder = new TextDecoder('utf-8')
    this.textEncoder = new TextEncoder()
    const context = this
    this.$refs.encryptUploadFileInput.addEventListener('change', function() {
      const file = this.files[0]
      const fr = new FileReader()
      const chunkSize = 32 * 200
      let start = 0
      let end = chunkSize
      fr.onload = async function() {
        const encryptedChunkObj = await context.encrypt(fr.result)
        // Download encrypted chunk Obj
        context.downloadStream(encryptedChunkObj)
      }
      fr.onloadend = function() {
        // keep track of bytes processed
        const processed = end - 1
        console.log('processed', processed)
        if (end > file.size) {
          console.log('load end')
          context.downloadFinished = true
          return
        }
        // Process next slice
        start += chunkSize
        end += chunkSize
        if (end >= file.size) {
          end = file.size + 1
        }   
        const nextSlice = file.slice(start, end)
        fr.readAsArrayBuffer(nextSlice)
      }
      const firstSlice = file.slice(start, end)
      fr.readAsArrayBuffer(firstSlice)
    })
  },
  methods: {
    onEncryptUpload() {
      if (!this.publicKeyInput) return
      this.$refs.encryptUploadFileInput.click()
    },
    /**
    * Encrypt file using rsa public key
    * ----------------------------------
    * RSA can only encrypt 256 bits minus padding/header data effectively == 
    * 256 bits == 32 bytes
    * https://kulkarniamit.github.io/whatwhyhow/howto/encrypt-decrypt-file-using-rsa-public-private-keys.html
    *
    * Therefore, Use AES encryption. It has a lmit of more than 250 million tb
    * Refer to:
    * https://security.stackexchange.com/questions/33434/rsa-maximum-bytes-to-encrypt-comparison-to-aes-in-terms-of-security
    * 
    * Use EthCrypto for AES encryption
    * Inside it handles aes-256-cbc encryption using eccrypto library which uses crypto
    */
    async encrypt(buffer) {
      buffer, EthCrypto
      const bufView = new Uint8Array(buffer)
      const bufStr = this.bufDecoder.decode(bufView)
      console.log(bufStr)
      const encryptedChunkObj = await EthCrypto.encryptWithPublicKey(this.publicKeyInput, bufStr)
      this.encryptedChunkObj = encryptedChunkObj
      return encryptedChunkObj
    },
    async decryptTest() {
      const privateKey = '0x43ccc31b4fb51db59b44e9bc02d23e65c5e16ceaf5e60db284eb94aeddb918f7'
      const decrypted = await EthCrypto.decryptWithPrivateKey(
        privateKey,
        this.encryptedChunkObj
      )
      console.log(decrypted)
    },
    downloadStream(encryptedChunkObj) {
      if (!this.fileStream) {
        console.log("initialize fileStream and writer")
        this.fileStream = streamSaver.createWriteStream('encrypted.json')
        this.writer = this.fileStream.getWriter()
        console.log(this.fileStream)
        console.log(this.writer)
      }
      const encryptedJSON = JSON.stringify(encryptedChunkObj)
      this.writer.write(this.textEncoder.encode(encryptedJSON))
    }
  }
}
</script>

<style>

</style>

