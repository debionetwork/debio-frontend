
<template>
   <div>
      <v-container>
         <v-row>
            <v-col cols="6">
               <!-- <v-text-field v-model="publicKeyInput" label="Public Key" />
               <v-text-field
                  v-model="specimentNumberInput"
                  label="Specimen Number"
               />
               <v-text-field v-model="ownerAddress" label="Owner Address" /> -->
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
                  @click="onEncryptUploadGenome"
                  :loading="uploaderLoading"
                  :percentage="uploadProgress"
               >
                  <v-icon size="64">mdi-upload-lock</v-icon>
                  <div>Encrypt and Upload Genome</div>
                  <input
                     type="file"
                     style="display: none"
                     ref="encryptUploadFileInputGenome"
                  />
               </SquareCardBtn>
               <v-btn :disabled="!encryptedObjGenome" @click="showDialog('genome')">
                  Upload to IPFS
               </v-btn>
            </v-col>
            <v-col cols="6" md="3" sm="4">
               <SquareCardBtn
                  @click="onEncryptUploadResult"
                  :loading="uploaderLoading"
                  :percentage="uploadProgress"
               >
                  <v-icon size="64">mdi-upload-lock</v-icon>
                  <div>Encrypt and Upload Result</div>
                  <input
                     type="file"
                     style="display: none"
                     ref="encryptUploadFileInputResult"
                  />
               </SquareCardBtn>
               <v-btn :disabled="!encryptedObjResult" @click="showDialog('result')">
                  Upload to IPFS
               </v-btn>
            </v-col>
         </v-row>
         <v-dialog v-model="dialog" persistent max-width="600px">
            <template>
               <v-card>
                  <v-card-title>Save File to IPFS</v-card-title>
                  <v-card-text>Are sure want save to IPFS?</v-card-text>
                  <v-divider></v-divider>

                  <v-card-actions>
                     <v-spacer></v-spacer>
                     <v-btn color="primary" text @click="uploadEncrypted">
                        Upload to Result
                     </v-btn>
                  </v-card-actions>
               </v-card>
            </template>
         </v-dialog>
         <v-dialog v-model="dialogFinalize" persistent max-width="600px">
            <template>
               <v-card>
                  <v-card-title class="headline grey lighten-2">
                     Finalize Transaction
                  </v-card-title>
                  <v-card-text>
                    Please input your password to finalize Transaction
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
                     <v-btn color="primary" text @click="resultSpeciment">
                        Save Result
                     </v-btn>
                  </v-card-actions>
               </v-card>
            </template>
         </v-dialog>
         <v-btn color="primary" :disabled="finalize" text @click="dialogFinalize=true">finalize </v-btn>
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
import Wallet from '../../../lib/dgnx-wallet'
import { mapState } from 'vuex'
import { SUCCESS } from '@/constants/specimen-status'



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
    labAddress: '',
    publicKeyInput: '',
    finalize: false,
    files: [],
    encryptedObjResult: null,
    encryptedObjGenome: null,
    fileName: '',
    dialog: false,
    dialogFinalize: false,
    password: '',
    uploaderLoading: false,
    uploadProgress: 0,
    fileType: null,
  }),
  async mounted() {
    const context = this;
    // this.publicKeyInput = "796061614a84e4a0497586c2bd8a1b6aefc8fb4f94b0a882105e9ec71e245f3b6ec8091a3ba2d0d05994d6ae321a853d1193dfc25db8f93dd4d1d3c4a7da48e6";
    this.specimentNumberInput = this.$route.params.number;
    this.labAddress = JSON.parse(localStorage.getKeystore())['address'];
    await this.getSpciments(this.labAddress);
    await this.getFileUploaded()
    this.$refs.encryptUploadFileInputResult.addEventListener('change', function() {
      const file = this.files[0]
      context.fileName = file.name
      const fr = new FileReader()
      fr.onload = async function() {
        console.log(fr.result)
        await context.encrypt(fr.result, 'result')
      }
      fr.readAsDataURL(file)
    })
    this.$refs.encryptUploadFileInputGenome.addEventListener('change', function() {
      const file = this.files[0]
      context.fileName = file.name

      const fr = new FileReader()
      fr.onload = async function() {
        await context.encrypt(fr.result, 'genome')
      }
      fr.readAsText(file)
    })
  },
  methods: {
    async getFileUploaded() {
      try {
          const address = this.ownerAddress;
          const arrFile = await this.contractDegenics.methods.getFile(this.specimentNumberInput).call({from: address});
          if (arrFile) {
            this.files = JSON.parse(arrFile);
          }
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
      const wallet = await Wallet.decrypt(keystore, this.password)
      this.address = wallet.address;
      this.publicKeyInput = wallet.publicKey;
      this.dialog = false;
    },
    onEncryptUploadResult() {
      if (this.uploaderLoading) return
      this.$refs.encryptUploadFileInputResult.click()
    },
    onEncryptUploadGenome() {
      if (this.uploaderLoading) return
      this.$refs.encryptUploadFileInputGenome.click()
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
    async encrypt(text, fileType) {
      if (fileType == 'genome') {
        this.encryptedObjGenome = null;
      }

      if (fileType == 'result') {
        this.encryptedObjResult = null;
      }

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
          // TODO make it not messy condition
          if (fileType == 'genome') {
            this.encryptedObjGenome = arrChunks;
          }

          if (fileType == 'result') {
            this.encryptedObjResult = arrChunks;
          }
          // this.encryptedObj = arrChunks;
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
      let fileType = this.fileType;
      let objEncripted = this.selectFile(fileType)
      this.loadingStart();
      console.log({fileType, arrFiles, objEncripted});
      for (let file of objEncripted) {
        const data = JSON.stringify(file)
        const blob = new Blob([ data ], {type: 'text/plain'})
        ipfsWorker.workerUpload.postMessage({seed: file.seed, file: blob}) // Access this object in e.data in worker
      }
      ipfsWorker.workerUpload.onmessage = async event => {
        // TODO simplify format data only needed in download from ipfs
        arrFiles.push(event.data);
        this.uploadProgress = arrFiles.length / objEncripted.length * 100;

        if (arrFiles.length == objEncripted.length) {
          const fileName= this.fileName;
          this.files.push({
            fileName,
            fileType,
            ipfsPath: arrFiles,
          })
          this.setEmptyEnctypted(fileType)
          this.fileType = null;
          this.loadingFinish();
        }
      }
    },
    async downloadEncryptedIPFS(index) {
        const channel = new MessageChannel();
        channel.port1.onmessage = cryptWorker.workerDecrypt;
        let privateKey = this.privateKey;
        let fileList = this.files[index].ipfsPath;
        const typeFile = "text/plain";
        ipfsWorker.workerDownload.postMessage({file: fileList, privateKey, typeFile});
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
        const wallet = await Wallet.decrypt(keystore, this.password)
        const abiData = this.contractDegenics.methods
          .analysisSucces(this.specimentNumberInput, JSON.stringify(this.files),"Sucess")
          .encodeABI()

        let tx = await sendTransaction(degenicsContract, wallet, abiData)

        console.log(tx, wallet.getAddressString());
        this.dialogFinalize = false;
      } catch (err) {
        this.dialogFinalize = false;
        console.error(err)
      }
    },
    async getSpciments(address) {
      try {
        let sn = this.specimentNumberInput;
        console.log(sn, address);
        const speciment = await this.contractDegenics.methods.specimenByNumber(sn).call({from: address})
        this.publicKeyInput = speciment.pubkey
        this.ownerAddress = speciment.owner;
        this.finalize = speciment.status == SUCCESS ? true : false;

      } catch (error) {
        console.log(error)
      }
    },
    loadingStart() {
      this.uploaderLoading = true;
      this.uploadProgress = 0;
    },
    loadingFinish() {
      this.uploaderLoading = false;
      this.uploadProgress = 0;
      this.dialog = false;
    },
    setEmptyEnctypted(fileType) {
      if (fileType == 'genome') {
        this.encryptedObjGenome = null;
      }

      if (fileType == 'result') {
        this.encryptedObjResult = null;
      }
    },
    showDialog(fileType) {
      this.dialog = true;
      this.fileType = fileType;
    },
    selectFile(fileType) {
      if (fileType == 'genome') {
        return this.encryptedObjGenome;
      }

      if (fileType == 'result') {
        return this.encryptedObjResult;
      }
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
