<template>
  <div>
    <template>
      <input
        type="file"
        style="display: none"
        ref="encryptUploadGenome"
      />
      <div v-if="genomeSucceed || hasGenomeFile" class="d-flex mt-5 mb-5">
        <v-row >
          <v-col>
            <b class="secondary--text card-header mb-2" style="display: block">VCF Data</b>
            <div v-for="(file, idx) in files.genome" :key="idx + '-' + file.fileName + '-' + file.fileType">
              <FileCard
                :filename="file.fileName"
                :ipfsUrl="getFileIpfsUrl(file)"
                :view-only="submitted"
                @edit="onEditClick('genome')"
                @delete="onFileDelete('genome')"
              />
            </div>
          </v-col>
        </v-row>
      </div>
      <div v-else class="mb-3 mt-3">
        <v-btn
          color="primary"
          large
          block
          :disabled="loading.genome || loading.report || genomeSucceed"
          @click="uploadGenome"
        >
          <v-icon left dark class="pr-4">
            mdi-dna
          </v-icon>
          Upload VCF Data
          <template v-slot:loader>
            {{ loadingStatus.genome }}
          </template>
        </v-btn>
      </div>
      <v-progress-linear
        v-if="loading.genome"
        class="mt-2"
        indeterminate color="primary"
      />
    </template>

    <template>
      <input
        type="file"
        style="display: none"
        ref="encryptUploadReport"
      />
      <div v-if="reportSucceed || hasReportFile" class="d-flex mt-5 mb-5">
        <v-row >
          <v-col>
            <b class="secondary--text card-header mb-2" style="display: block">Report Files</b>
            <div v-for="(file, idx) in files.report" :key="idx + '-' + file.fileName + '-' + file.fileType">
              <FileCard
                :filename="file.fileName"
                :ipfsUrl="getFileIpfsUrl(file)"
                :view-only="submitted"
                @edit="onEditClick('report')"
                @delete="onFileDelete('report')"
              />
            </div>
          </v-col>
        </v-row>
      </div>
      <div v-else class="mb-3">
        <v-btn
          color="primary"
          large
          block
          :disabled="loading.genome || loading.report || reportSucceed"
          @click="uploadReport"
        >
          <v-icon left dark class="pr-4">
            mdi-file-document-multiple
          </v-icon>
          Upload Report
          <template v-slot:loader>
            {{ loadingStatus.report }}
          </template>
        </v-btn>
      </div>
      <v-progress-linear
        v-if="loading.report"
        class="mt-2"
        indeterminate color="primary"
      />
    </template>

    <div v-if="genomeSucceed && reportSucceed && !submitted" class="mb-3">
      <v-btn
        color="primary"
        large
        block
        class="mt-6"
        :disabled="isLoading"
        @click="confirmationDialog = true"
      >
        Send Report to Customer
        <template v-slot:loader>
          <v-progress-linear
            v-if="loading.report"
            class="mt-2"
            indeterminate color="primary"
          />
        </template>
      </v-btn>
    </div>
    <DialogAlert
      :show="genomeUploadSucceedDialog"
      btnText="Continue"
      textAlert="VCF data has been uploaded"
      imgPath="success.png"
      imgWidth="50"
      @close="genomeUploadSucceedDialog = false"
      />

    <DialogAlert
      :show="reportUploadSucceedDialog"
      btnText="Continue"
      textAlert="Report has been uploaded."
      imgPath="success.png"
      imgWidth="50"
      @close="reportUploadSucceedDialog = false"
      />

    <Dialog :show="confirmationDialog" @close="!confirmationDialog">
      <template v-slot:title>
          <div></div>
      </template>
      <template v-slot:body>
          <div class="d-flex justify-center pb-5 pt-5">
              <v-img v-bind:src="require('@/assets/debio-logo.png')" max-width="50" />
          </div>
          <div align="center" class="pb-5">Are you sure you want to send the report to customer?</div>
      </template>
      <template v-slot:actions>
          <v-col col="12" md="6">
            <Button @click="sendTestResult" :loading="isLoading" elevation="2" dark>Yes</Button>
          </v-col>
          <v-col col="12" md="6">
            <Button @click="confirmationDialog = false" elevation="2" color="purple" dark>No</Button>
          </v-col>
      </template>
    </Dialog>
  </div>
</template>


<script>
import { mapGetters, mapState } from 'vuex'
import serviceHandler from "@/mixins/serviceHandler"
import FileCard from './FileCard'
import ipfsWorker from '@/web-workers/ipfs-worker'
import cryptWorker from '@/web-workers/crypt-worker'
import specimenFilesTempStore from '@/lib/specimen-files-temp-store'
import Kilt from '@kiltprotocol/sdk-js'
import { fulfillOrder } from '@/lib/polkadotProvider/command/orders'
import DialogAlert from '@/components/Dialog/DialogAlert'
import Dialog from '@/components/Dialog'
import Button from '@/components/Button'
import { submitTestResult, processDnaSample } from '@/lib/polkadotProvider/command/geneticTesting'
import { queryDnaTestResults } from "@/lib/polkadotProvider/query/geneticTesting"
import localStorage from "@/lib/local-storage"


export default {
  name: 'ProcessSpecimen',
  components: {
    FileCard,
    DialogAlert,
    Dialog,
    Button
  },
  mixins: [serviceHandler],
  props: {
    orderId: String,
    specimenNumber: String,
    specimenStatus: String,
    publicKey: [Uint8Array, String],
  },
  data: () => ({
    identity: null,
    genomeSucceed: false,
    reportSucceed: false,
    genomeUploadSucceedDialog: false,
    reportUploadSucceedDialog: false,
    confirmationDialog: false,
    comment: "",
    reportLink: "",
    resultLink: "",
    submitted: false,
    isProcessed: false,
    files: {
      genome: [],
      report: [],
    },
    loading: {
      genome: false,
      report: false,
    },
    loadingStatus: {
      genome: '',
      report: '',
    },
    encryptProgress: {
      genome: 0,
      report: 0,
    },
    uploadProgress: {
      genome: 0,
      report: 0,
    },
  }),
  async mounted(){    
    // Add file input event listener
    this.addFileUploadEventListener(this.$refs.encryptUploadGenome, 'genome')
    this.addFileUploadEventListener(this.$refs.encryptUploadReport, 'report')

    this.identity = Kilt.Identity.buildFromMnemonic(this.mnemonic)
    
    const testResult = await queryDnaTestResults(this.api, this.specimenNumber)
    if(testResult) this.setUploadFields(testResult)
  },
  computed: {
    ...mapGetters({
      api: 'substrate/getAPI',
      pair: 'substrate/wallet',
    }),

    ...mapState({
      mnemonic: state => state.substrate.mnemonicData.mnemonic
    }),

    disableRejectButton(){
      return this.genomeSucceed && this.reportSucceed
    },

    disableSendButton(){
      return !this.disableRejectButton
    },
    
    hasGenomeFile() {
      return this.files.genome.length > 0
    },

    hasReportFile() {
      return this.files.report.length > 0
    }
  },
  methods:{
    setUploadFields(testResult){
      const { result_link, report_link } = testResult
      if(result_link){
        const genomeFile = {
          fileName: 'Genome File', // FIXME: Harusnya di simpan di dan di ambil dari blockchain  
          ipfsPath: [{ data: { path: result_link.split('/')[result_link.split('/').length-1] } }]
        }
        this.files.genome.push(genomeFile)
        this.isProcessed = true
      }
      if(report_link){
        const reportFile = {
          fileName: 'Report File', // FIXME: Harusnya di simpan di dan di ambil dari blockchain
          ipfsPath: [{ data: { path: report_link.split('/')[report_link.split('/').length-1] } }]
        }
        this.files.report.push(reportFile)
        this.isProcessed = true
      }

      if (this.isProcessed) {
        this.submitted = true
      }
    },

    uploadGenome() {
      this.$refs.encryptUploadGenome.click()
    },

    uploadReport() {
      this.$refs.encryptUploadReport.click()
    },

    /**
     * @returns {String} The first ipfs path (a file has multiple ipfs path, because a file may be chunked)
     */
    getFileIpfsPath(file) {
      return file.ipfsPath[0].data.path
    },

    getFileIpfsUrl(file) {
      const path = this.getFileIpfsPath(file)
      return `https://ipfs.io/ipfs/${path}`
    },

    async submitTestResult(callback = ()=>{}) {
      let genomeLink = ""
      if(this.files.genome.length){
        genomeLink = this.getFileIpfsUrl(this.files.genome[0])
      }

      let reportLink = ""
      if(this.files.report.length){
        reportLink = this.getFileIpfsUrl(this.files.report[0])      
      }

      await this.dispatch(
        submitTestResult,
        this.api,
        this.pair,
        this.specimenNumber,
        {
          comment: this.comment,
          report_link: reportLink,
          result_link: genomeLink
        },
        callback
      )
    },

    sendTestResult() {
      this.submitTestResult(async () => {
        await this.dispatch(
          fulfillOrder,
          this.api,
          this.pair,
          this.orderId,
        )
        this.resultReady()
      })
    },
    
    async resultReady() {
      this.isProcessing = true
      await this.dispatch(
        processDnaSample,
        this.api,
        this.pair,
        this.specimenNumber,
        "ResultReady",
        () => {
          this.$emit('resultReady')
          this.isLoading = false
          this.confirmationDialog = false
          this.submitted = true
        }
      )
      this.sendingNotification()
    },

    addFileUploadEventListener(fileInputRef, fileType) {
      const context = this
      fileInputRef.addEventListener('change', function(e) {
        const target = e.target || e.srcElement
        if (!target.value.length) return

        context.loading[fileType] = true
        const file = this.files[0]
        file.fileType = fileType // attach fileType to file, because fileType is not accessible in fr.onload scope
        const fr = new FileReader()
        if (file.type === "application/pdf") fr.readAsDataURL(file)
        fr.onload = async function() {
          try {
            // Encrypt
            const encrypted = await context.encrypt({
              text: fr.result,
              fileType: file.fileType,
              fileName: file.name,
            })
            
            const { chunks, fileName: encFileName, fileType: encFileType } = encrypted
            // Upload
            const uploaded = await context.upload({
              encryptedFileChunks: chunks,
              fileName: encFileName,
              fileType: encFileType
            })
            
            // files is array, but currently only support storing 1 file for each type
            const { fileName, fileType, ipfsPath } = uploaded
            if (context.files[fileType].length > 0) {
              context.files[fileType][0] = { fileName, fileType, ipfsPath }
            } else {
              context.files[fileType].push({ fileName, fileType, ipfsPath })
            }

            // Save files to localStorage
            specimenFilesTempStore.set(context.specimenNumber, context.files)
            context.loading[file.fileType] = false

            // Emit finish
            if(file.fileType == 'genome') {
              context.genomeSucceed = true
              context.genomeUploadSucceedDialog = true
              context.$emit('uploadGenome')
            }
            if(file.fileType == 'report') {
              context.reportSucceed = true
              context.reportUploadSucceedDialog = true
              context.$emit('uploadReport')
            }
          } catch (err) {
            console.error(err)
          } finally {
            context.loading[file.fileType] = false
          }
        }
        fr.readAsText(file)
      })
    },

    encrypt({ text, fileType, fileName }) {
      const context = this
      this.loadingStatus[fileType] = 'Encrypting'

      return new Promise((resolve, reject) => {
        try {
          const pair = { 
            secretKey: context.identity.boxKeyPair.secretKey,
            publicKey: context.publicKey // Customer's box publicKey
          }
          const arrChunks = []
          let chunksAmount
          cryptWorker.workerEncrypt.postMessage({ pair, text }) // Access this object in e.data in worker
          cryptWorker.workerEncrypt.onmessage = event => {
            // The first returned data is the chunksAmount
            if(event.data.chunksAmount) {
              chunksAmount = event.data.chunksAmount
              return
            }

            arrChunks.push(event.data)
            this.encryptProgress[fileType] = arrChunks.length / chunksAmount * 100

            if (arrChunks.length == chunksAmount ) {
              resolve({
                fileName: fileName,
                chunks: arrChunks,
                fileType: fileType
              })
              // Cleanup
              this.encryptProgress[fileType] = 0
              this.loadingStatus[fileType] = ''
            }
          }

        } catch (err) {
          reject(new Error(err.message))
        }
      })
    },

    upload({ encryptedFileChunks, fileName, fileType }) {
      this.loadingStatus[fileType] = 'Uploading'
      const chunkSize = 10 * 1024 * 1024 // 10 MB
      let offset = 0
      const data = JSON.stringify(encryptedFileChunks)
      const blob = new Blob([ data ], { type: 'text/plain' })

      return new Promise((resolve, reject) => {
        try {
          const fileSize = blob.size
          do {
            let chunk = blob.slice(offset, chunkSize + offset);
            ipfsWorker.workerUpload.postMessage({
              seed: chunk.seed, file: blob
            })
            offset += chunkSize
          } while((chunkSize + offset) < fileSize)
          
          let uploadSize = 0
          const uploadedResultChunks = []
          ipfsWorker.workerUpload.onmessage = async event => {
            uploadedResultChunks.push(event.data)
            uploadSize += event.data.data.size
            this.uploadProgress[fileType] =
              uploadSize / fileSize * 100
              
            if (uploadSize >= fileSize) {
              resolve({
                fileName: fileName,
                fileType: fileType,
                ipfsPath: uploadedResultChunks
              })
              // Cleanup
              this.uploadProgress[fileType] = 0
              this.loadingStatus[fileType] = ''
            }
          }

        } catch (err) {
          reject(new Error(err.message))
        }
      })
    },

    onEditClick(fileType) {
      if (fileType == 'genome') this.uploadGenome()
      if (fileType == 'report') this.uploadReport()
    },

    onFileDelete(fileType) {
      this.files[fileType] = []
      if (fileType == 'genome') {
        this.genomeSucceed = false
        this.$refs.encryptUploadGenome.value = null
      }
      if (fileType == 'report') {
        this.reportSucceed = false
        this.$refs.encryptUploadReport.value = null
      }
    },

    sendingNotification() {
      const address = localStorage.getAddress()
      const storageName = "LOCAL_NOTIFICATION_BY_ADDRESS_" + address + "_" + "customer"
      const listNotificationJson = localStorage.getLocalStorageByName(storageName)

      let listNotification = []
      if (listNotificationJson != null && listNotificationJson != "") {
        listNotification = JSON.parse(listNotificationJson)
      }

      const dateSet = new Date()
      const timestamp = dateSet.getTime().toString()
      const notifDate = dateSet.toLocaleString("en-US", {
        weekday: "short",
        day: "numeric", 
        year: "numeric",
        month: "long", 
        hour: "numeric",
        minute: "numeric",
      });

      const notification = {
        message: "Congrats! You got 5 DBIO!",
        timestamp: timestamp,
        data: "",
        route: "result-test",
        params: "",
        read: false,
        notifDate: notifDate,
      }

      listNotification.push(notification)
      localStorage.setLocalStorageByName(storageName, JSON.stringify(listNotification));
      listNotification.reverse();
    },
  },
}
</script>

<style scoped>
.confirmation-background{
    background: #E6E6E6;
}
</style>