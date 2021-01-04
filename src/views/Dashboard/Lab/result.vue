
<template>
   <div>
      <v-container>
         <v-row>
            <v-col cols="6">
               <v-text-field v-model="publicKeyInput" label="Public Key" />
               <v-text-field
                  v-model="specimentNumberInput"
                  label="Specimen Number"
               />
               <v-text-field v-model="ownerAddress" label="Owner Address" />
            </v-col>
         </v-row>
         <v-row>
            <v-col
               v-for="(file, index) in files"
               :key="file.name"
               cols="6"
               md="3"
               sm="4"
            >
               <SquareCardBtn @click="downloadEncryptedIPFS(index)">
                  <v-icon size="64">mdi-download</v-icon>
                  <div>{{ file.fileName }}</div>
               </SquareCardBtn>
            </v-col>
            <v-col cols="6" md="3" sm="4">
               <SquareCardBtn
                  @click="onEncryptUpload"
                  :loading="uploaderLoading"
                  :percentage="uploadProgress"
               >
                  <v-icon size="64">mdi-upload-lock</v-icon>
                  <div>Encrypt and Upload</div>
                  <input
                     type="file"
                     style="display: none"
                     ref="encryptUploadFileInput"
                  />
               </SquareCardBtn>
               <v-btn :disabled="!encryptedObj" @click="dialog = true">
                  Upload to IPFS
               </v-btn>
            </v-col>
         </v-row>
         <v-dialog v-model="dialog" max-width="600px">
            <template>
               <v-card>
                  <v-card-title class="headline grey lighten-2">
                     Please insert your password
                  </v-card-title>
                  <v-card-text>
                     <v-text-field
                        class="mt-4"
                        outlined
                        auto-grow
                        type="password"
                        v-model="password"
                        label="Input your password"
                     />
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                     <v-spacer></v-spacer>
                     <v-btn color="primary" text @click="uploadEncrypted">
                        Save Result
                     </v-btn>
                  </v-card-actions>
               </v-card>
            </template>
         </v-dialog>
      </v-container>
   </div>
</template>

<script>
import EthCrypto from 'eth-crypto'
import SquareCardBtn from '../../../components/SquareCardBtn'
import ipfsWorker from '../../../web-workers/ipfs-worker'
import cryptWorker from '../../../web-workers/crypt-worker'
import sendTransaction from '../../../lib/send-transaction'
import localStorage from '../../../lib/local-storage'
import Wallet from 'ethereumjs-wallet'
import { mapState } from 'vuex'



export default {
  name: 'lab-result',
  components: {
    SquareCardBtn,
  },
  data: () => ({
    // Hardcoded privateKey for dev
    privateKey: '0xd2b4ac161f7f82d910a5560710d14ca8262b819b369d9bcc08b58d3ecf966465',
    specimentNumberInput: '',
    ownerAddress: '',
    publicKeyInput: '',
    files: [],
    encryptedObj: null,
    fileName: '',
    dialog: false,
    password: '',
    uploaderLoading: false,
    uploadProgress: 0,
  }),
  async mounted() {
    const context = this;
    this.publicKeyInput = "796061614a84e4a0497586c2bd8a1b6aefc8fb4f94b0a882105e9ec71e245f3b6ec8091a3ba2d0d05994d6ae321a853d1193dfc25db8f93dd4d1d3c4a7da48e6";
    this.specimentNumberInput = this.$route.params.number;
    this.ownerAddress = this.$route.params.owner;
    await this.getFileUploaded()
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
    async getFileUploaded() {
      try {
          const address = this.ownerAddress;
          const arrFile = await this.contractDegenics.methods.getFile(this.specimentNumberInput).call({from: address});
          this.files = JSON.parse(arrFile);
      } catch (error) {
        console.error(error)
      }
    },
    async decryptWallet() {
      this.dialog = true;
      if (this.password == '') {
        return;
      }
      const keystore = localStorage.getKeystore()
      const wallet = await Wallet.fromV3(keystore, this.password)
      this.address = wallet.getAddressString();
      this.dialog = false;
    },
    onEncryptUpload() {
      if (this.uploaderLoading) return
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
      this.encryptedObj = null;
      const publicKey = this.publicKeyInput;
      const arrChunks = [];
      let chunksAmount;
      this.loadingStart();

      cryptWorker.workerEncrypt.postMessage({ publicKey, text}) // Access this object in e.data in worker
      cryptWorker.workerEncrypt.onmessage = event => {
        if(event.data.chunksAmount) {
          chunksAmount = event.data.chunksAmount;
          return;
        }
        arrChunks.push(event.data)
        this.uploadProgress = arrChunks.length / chunksAmount * 100;
        if (arrChunks.length == chunksAmount ) {
          this.encryptedObj = arrChunks;
          chunksAmount = 0;
          this.loadingFinish();
        }

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
      let arrFiles=[];
      this.loadingStart();
      for (let file of this.encryptedObj) {
        const data = JSON.stringify(file)
        const blob = new Blob([ data ], {type: 'text/plain'})
        ipfsWorker.workerUpload.postMessage({seed: file.seed, file: blob}) // Access this object in e.data in worker
      }
      ipfsWorker.workerUpload.onmessage = async event => {
        arrFiles.push(event.data);
        this.uploadProgress = arrFiles.length / this.encryptedObj.length * 100;

        if (arrFiles.length == this.encryptedObj.length) {
          const fileName= this.fileName;
          this.files.push({
            fileName,
            ipfsPath: arrFiles,
          })
          await this.resultSpeciment();
          this.encryptedObj = null;
          this.loadingFinish();
        }
      }
    },
    async downloadEncryptedIPFS(index) {
        const channel = new MessageChannel();
        channel.port1.onmessage = cryptWorker.workerDecrypt;
        let privateKey = this.privateKey;
        let fileList = this.files[index].ipfsPath;
        ipfsWorker.workerDownload.postMessage({file: fileList, privateKey});
        ipfsWorker.workerDownload.onmessage = event => {
          this.download(event.data, this.files[index].fileName)
        }
    },
    async resultSpeciment() {
      try {

        // Retrieve wallet
        console.log('decrypting Keystore...')
        const degenicsContract = this.contractDegenics._address;
        const keystore = localStorage.getKeystore()
        const wallet = await Wallet.fromV3(keystore, this.password)
        const abiData = this.contractDegenics.methods
          .analysisSucces(this.specimentNumberInput, JSON.stringify(this.files),wallet.getPublicKeyString())
          .encodeABI()

        let tx = await sendTransaction(degenicsContract, wallet, abiData)

        console.log(tx, wallet.getAddressString());
        this.dialog = false;
      } catch (err) {
        this.dialog = false;
        console.error(err)
      }
    },
    loadingStart() {
      this.uploaderLoading = true;
      this.uploadProgress = 0;
    },
    loadingFinish() {
      this.uploaderLoading = false;
      this.uploadProgress = 0;
    }
  },
  computed: {
    ...mapState({
      contractDegenics: state => state.ethereum.contracts.contractDegenics,
    })
  },
}


</script>

<style>
</style>
