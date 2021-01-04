
<template>
   <div>
      <v-container>
         <v-row>
            <v-col cols="6">
               <v-text-field
                  v-model="specimentNumberInput"
                  label="Specimen Number"
               />
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
               <MenuCard
                  icon="mdi-file-document-multiple-outline"
                  :title="file.fileName"
                  sub-title="View your test reports"
                  @click="downloadDecryptedFromIPFS(index)"
               />
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
                     <v-btn color="primary" text @click="decryptWallet">
                        decryt wallet
                     </v-btn>
                  </v-card-actions>
               </v-card>
            </template>
         </v-dialog>
      </v-container>
   </div>
</template>

<script>
import MenuCard from '../../../components/MenuCard'
import ipfsWorker from '../../../web-workers/ipfs-worker'
import localStorage from '../../../lib/local-storage'
import Wallet from 'ethereumjs-wallet'
import { mapState } from 'vuex'



export default {
  name: 'test-result',
  components: {
    MenuCard,
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
    await this.decryptWallet()
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
      this.ownerAddress = wallet.getAddressString();
      this.dialog = false;
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
    async downloadDecryptedFromIPFS(index) {
        let privateKey = this.privateKey;
        let fileList = this.files[index].ipfsPath;
        ipfsWorker.workerDownload.postMessage({file: fileList, privateKey});
        ipfsWorker.workerDownload.onmessage = event => {
          this.download(event.data, this.files[index].fileName)
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
  watch: {
    async ownerAddress(){
      await this.getFileUploaded();
    },
  }
}


</script>

<style>
</style>
