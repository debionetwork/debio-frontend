
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
        <v-col v-for="(file, index) in files" :key="file.name" cols="6" md="3" sm="4">
          <SquareCardBtn @click="downloadEncryptedIPFS(index)">
            <v-icon size="64">mdi-download</v-icon>
            <div>{{file.fileName}}</div>
          </SquareCardBtn>
        </v-col>
        <v-col cols="6" md="3" sm="4">
          <SquareCardBtn @click="onEncryptUpload">
            <v-icon size="64">mdi-upload-lock</v-icon>
            <div>Encrypt and Upload</div>
            <input type="file" style="display: none" ref="encryptUploadFileInput" />
          </SquareCardBtn>
          <v-btn :disabled="!encryptedObj" @click="uploadEncrypted">
            Upload to IPFS
          </v-btn>
        </v-col>
      </v-row>

    </v-container>
  </div>
</template>

<script>
import EthCrypto from 'eth-crypto'
import SquareCardBtn from '../../../components/SquareCardBtn'
import ipfsWorker from '../../../web-workers/ipfs-worker'
import cryptWorker from '../../../web-workers/crypt-worker'

export default {
  name: 'Lab',
  components: {
    SquareCardBtn,
  },
  data: () => ({
    // Hardcoded privateKey for dev
    privateKey: '0xd2b4ac161f7f82d910a5560710d14ca8262b819b369d9bcc08b58d3ecf966465',
    publicKeyInput: '',
    files: [],
    encryptedObj: null,
    fileName: '',
  }),
  mounted() {
    const context = this;
    this.publicKeyInput = "796061614a84e4a0497586c2bd8a1b6aefc8fb4f94b0a882105e9ec71e245f3b6ec8091a3ba2d0d05994d6ae321a853d1193dfc25db8f93dd4d1d3c4a7da48e6";

    this.$refs.encryptUploadFileInput.addEventListener('change', function() {
      const file = this.files[0]
      context.fileName = file.name
      const fr = new FileReader()
      fr.onload = async function() {
        await context.encrypt(fr.result)
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
    async downloadDecrypted() {
      const text = JSON.stringify(this.encryptedObj);
      const privateKey = this.privateKey;
      cryptWorker.workerDecrypt.postMessage({ privateKey, text});
      cryptWorker.workerDecrypt.onmessage = event => {
        const decrypted = event.data;
        this.download(decrypted, this.fileName)
      }
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
      let chunksAmount;
      let arrChunks=[];
      ipfsWorker.workerUpload.postMessage(blob) // Access this object in e.data in worker
      ipfsWorker.workerUpload.onmessage = event => {
        console.log(event.data)
        if(event.data.chunksAmount) {
          chunksAmount = event.data.chunksAmount;
          return;
        }
        arrChunks.push(event.data);
        if (chunksAmount == arrChunks.length) {
          const fileName= this.fileName;
          this.files.push({
            fileName,
            ipfsPath: arrChunks,
          })
          this.encryptedObj = null;
        }
      }
    },
    async downloadEncryptedIPFS(index) {
        const channel = new MessageChannel();
        channel.port1.onmessage = cryptWorker.workerDecrypt;

        ipfsWorker.workerDownload.postMessage(this.files[index].ipfsPath);
        ipfsWorker.workerDownload.onmessage = event => {
          let privateKey = this.privateKey;
          let text = event.data;
          console.log(event.data)
          cryptWorker.workerDecrypt.postMessage({ privateKey, text}, [channel.port2]);
        }

        cryptWorker.workerDecrypt.onmessage = event => {
          const decrypted = event.data;
          this.download(decrypted, this.fileName)
        }
    }
  }
}
</script>

<style>

</style>
