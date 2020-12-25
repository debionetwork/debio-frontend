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
      <v-btn :disabled="!encryptedObj" @click="decryptTest">
        Test decrypt
      </v-btn>
      <v-btn :disabled="!encryptedObj" @click="downloadEncrypted">
        Download Encrypted
      </v-btn>
      <v-btn :disabled="!encryptedObj" @click="downloadDecrypted">
        Download Decrypted
      </v-btn>
    </v-container>
  </div>
</template>

<script>
import EthCrypto from 'eth-crypto'
import SquareCardBtn from '../../../components/SquareCardBtn'

export default {
  name: 'Lab',
  components: {
    SquareCardBtn,
  },
  data: () => ({
    // Hardcoded privateKey for dev
    privateKey: '0x43ccc31b4fb51db59b44e9bc02d23e65c5e16ceaf5e60db284eb94aeddb918f7',
    publicKeyInput: '',
    encryptedObj: null,
    fileName: '',
  }),
  mounted() {
    const context = this
    this.$refs.encryptUploadFileInput.addEventListener('change', function() {
      const file = this.files[0]
      context.fileName = file.name
      const fr = new FileReader()
      fr.onload = async function() {
        console.log('file loaded')
        await context.encrypt(fr.result)
        console.log(context.encryptedObj)
      }
      fr.readAsText(file)
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
    async encrypt(text) {
      console.log("Encrypting...")
      this.encryptedObj = await EthCrypto.encryptWithPublicKey(this.publicKeyInput, text)
      console.log("Encrypted")
      console.log(this.encryptedObj)
    },
    async decryptTest() {
      console.log("Decrypting...")
      const decrypted = await EthCrypto.decryptWithPrivateKey(
        this.privateKey,
        this.encryptedObj
      )
      console.log("Decrypted")
      console.log(decrypted)
    },
    downloadEncrypted() {
      const encryptedJSON = JSON.stringify(this.encryptedObj)
      this.download(encryptedJSON, this.fileName + '-encrypted')
    },
    async downloadDecrypted() {
      const decrypted = await EthCrypto.decryptWithPrivateKey(
        this.privateKey,
        this.encryptedObj
      )
      this.download(decrypted, this.fileName + '-decrypted')
    },
    download(data, fileName) {
      const blob = new Blob([ data ], {type: 'text/plain'})
      const e = document.createEvent('MouseEvents')
      const a = document.createElement('a')
      a.download = fileName
      a.href = window.URL.createObjectURL(blob)
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      a.dispatchEvent(e)
    }
  }
}
</script>

<style>

</style>
