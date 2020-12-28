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
      <v-btn :disabled="!encryptedObj" @click="uploadEncrypted">
        Upload Encrypted IPFS
      </v-btn>
      <v-btn :disabled="!encryptedObj" @click="downloadEncryptedIPFS">
        Download Decrypted IPFS
      </v-btn>
    </v-container>
  </div>
</template>

<script>
import EthCrypto from 'eth-crypto'
import SquareCardBtn from '../../../components/SquareCardBtn'
import ipfsWorker from '../../../web-workers/ipfs-worker'
import cryptWorker from '../../../web-workers/crypt-worker'
import IPFSHttpClient from 'ipfs-http-client';


export default {
  name: 'Lab',
  components: {
    SquareCardBtn,
  },
  data: () => ({
    // Hardcoded privateKey for dev
    privateKey: '0xd2b4ac161f7f82d910a5560710d14ca8262b819b369d9bcc08b58d3ecf966465',
    publicKeyInput: '',
    encryptedObj: null,
    fileName: '',
    // ipfsPath: 'QmegsjfWS2DiFvrLWTMtKSmKhDMUpJX2G5PUW2VUMRxTZa',
    ipfsPath: '',
  }),
  mounted() {
    const context = this;
    this.publicKeyInput = "796061614a84e4a0497586c2bd8a1b6aefc8fb4f94b0a882105e9ec71e245f3b6ec8091a3ba2d0d05994d6ae321a853d1193dfc25db8f93dd4d1d3c4a7da48e6";

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
      const publicKey = this.publicKeyInput;
      cryptWorker.workerEncrypt.postMessage({ publicKey, text}) // Access this object in e.data in worker
      cryptWorker.workerEncrypt.onmessage = event => {
        console.log("Message Encrypted: ", event)
        this.encryptedObj = event.data;
      }
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
    },
    uploadEncrypted() {
      const data = JSON.stringify(this.encryptedObj)
      const blob = new Blob([ data ], {type: 'text/plain'})
      ipfsWorker.workerUpload.postMessage(blob) // Access this object in e.data in worker
      ipfsWorker.workerUpload.onmessage = event => {
        this.ipfsPath = event.data.path;
        console.log(event)
      }
    },
    async downloadEncryptedIPFS() {

      const ipfs = IPFSHttpClient({host: 'ipfs.infura.io', port: 5001, protocol: 'https'});
      const res = await ipfs.get("/ipfs/"+this.ipfsPath);
      const content = await res.next()
      let dt = await content.value.content.next()
      let dts = dt.value
      console.log(dt);
      for await (let dtd of content.value.content) {
        var tmp = new Int8Array(dts.length + dtd.length);
        tmp.set(dts);
        tmp.set(dtd, dts.length);
        dts = tmp;
      }
      const fl = new Blob([ dts ], {type: 'text/plain'});
      const encrypted = await fl.text();
      console.log("Prepare decrypt");
      const decrypted = await EthCrypto.decryptWithPrivateKey(this.privateKey, JSON.parse(encrypted))

      this.download(decrypted, this.fileName)
    }
  }
}
</script>

<style>

</style>
