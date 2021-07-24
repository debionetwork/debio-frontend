<template>
  <div>
    <div v-if="submitted">
      <div class="d-flex mt-5 mb-5 justify-space-between">
        <v-row>
          <v-col>
            <b class="secondary--text card-header mb-2" style="display: block">Genome Files</b>
            <div v-for="(file, idx) in files.genome" :key="idx + '-' + file.fileName + '-' + file.fileType">
              <FileCard :filename="file.fileName" :ipfsUrl="getFileIpfsUrl(file)" :hideDelete="true"/>
            </div>
          </v-col>
        </v-row>
        <v-row class="ml-5">
          <v-col>
            <b class="secondary--text card-header mb-2" style="display: block">Report Files</b>
            <div v-for="(file, idx) in files.report" :key="idx + '-' + file.fileName + '-' + file.fileType">
              <FileCard :filename="file.fileName" :ipfsUrl="getFileIpfsUrl(file)" :hideDelete="true"/>
            </div>
          </v-col>
        </v-row>
      </div>
      <v-alert
          type="success"
          >Specimen Processed</v-alert>
    </div>
    <div v-else>
      <div class="d-flex justify-space-evenly mt-5">
        <div class="mb-3 mr-3" style="width: 50%">
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
            <v-spacer v-if="genomeSucceed" />
            Upload Genome
            <v-spacer v-if="genomeSucceed" />
            <v-icon v-if="genomeSucceed" right dark color="teal accent-2" class="pr-4">
              mdi-check-circle
            </v-icon>
            <template v-slot:loader>
              {{ loadingStatus.genome }}
            </template>
            <input
              type="file"
              style="display: none"
              ref="encryptUploadGenome"
            />
          </v-btn>
          <v-progress-linear
            v-if="loading.genome"
            class="mt-2"
            indeterminate color="primary"
          />
        </div>
        <div class="mb-3" style="width: 50%">
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
            <v-spacer v-if="reportSucceed" />
            Upload Report
            <v-spacer v-if="reportSucceed" />
            <v-icon v-if="reportSucceed" right dark color="teal accent-2" class="pr-4">
              mdi-check-circle
            </v-icon>
            <template v-slot:loader>
              {{ loadingStatus.report }}
            </template>
            <input
              type="file"
              style="display: none"
              ref="encryptUploadReport"
            />
          </v-btn>
          <v-progress-linear
            v-if="loading.report"
            class="mt-2"
            indeterminate color="primary"
          />
        </div>
      </div>
      <div class="d-flex justify-space-evenly">
        <div class="mb-3 mr-3" style="width: 50%">
          <v-btn
            color="primary"
            large
            block
            :disabled="disableSendButton"
            @click="sendTestResult"
            :loading="isLoading"
            >SEND</v-btn>
        </div>
        <div class="mb-3" style="width: 50%">
          <v-btn
            style="color: white"
            color="yellow"
            large
            block
            :disabled="disableRejectButton"
            >REJECT</v-btn>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { mapGetters, mapState } from 'vuex'
import FileCard from './FileCard'
import ipfsWorker from '@/web-workers/ipfs-worker'
import cryptWorker from '@/web-workers/crypt-worker'
import specimenFilesTempStore from '@/lib/specimen-files-temp-store'
import Kilt from '@kiltprotocol/sdk-js'
import { fulfillOrder } from '@/lib/polkadotProvider/command/orders'
import { submitTestResult } from '@/lib/polkadotProvider/command/geneticTesting'
import { queryDnaTestResults } from '@/lib/polkadotProvider/query/geneticTesting'

export default {
  name: 'ProcessSpecimen',
  components: {
    FileCard,
  },
  props: {
    orderId: String,
    specimenNumber: String,
    publicKey: [Uint8Array, String],
  },
  data: () => ({
    identity: null,
    genomeSucceed: false,
    reportSucceed: false,
    comment: "",
    reportLink: "",
    resultLink: "",
    submitted: false,
    isLoading: false,
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
      }
      if(report_link){
        const reportFile = {
          fileName: 'Report File', // FIXME: Harusnya di simpan di dan di ambil dari blockchain
          ipfsPath: [{ data: { path: report_link.split('/')[report_link.split('/').length-1] } }]
        }
        this.files.report.push(reportFile)
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

      await submitTestResult(
        this.api,
        this.pair,
        this.specimenNumber,
        true,
        {
          comment: this.comment,
          report_link: reportLink,
          result_link: genomeLink
        },
        callback
      )
    },
    sendTestResult() {
      this.isLoading = true
      this.submitTestResult(async () => {
        await fulfillOrder(
          this.api,
          this.pair,
          this.orderId,
        )

        this.$emit('submitTestResult')
        this.submitted = true
        this.isLoading = false
      })
    },
    addFileUploadEventListener(fileInputRef, fileType) {
      const context = this
      fileInputRef.addEventListener('change', function() {
        context.loading[fileType] = true
        const file = this.files[0]
        file.fileType = fileType // attach fileType to file, because fileType is not accessible in fr.onload scope
        const fr = new FileReader()
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
            const { fileName, fileType, ipfsPath } = uploaded
            context.files[fileType].push({ fileName, fileType, ipfsPath })

            // Save files to localStorage
            specimenFilesTempStore.set(context.specimenNumber, context.files)
            context.loading[file.fileType] = false

            // Emit finish
            if(file.fileType == 'genome') {
              context.genomeSucceed = true
              context.$emit('uploadGenome')
            }
            if(file.fileType == 'report') {
              context.reportSucceed = true
              context.$emit('uploadReport')
            }
          } catch (err) {
            console.error(err)
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
    onFileDelete(file) {
      const fileType = file.fileType
      const ipfsPath = file.ipfsPath[0].data.path

      const tempFiles = this.files[fileType].filter(file => {
        return file.ipfsPath[0].data.path != ipfsPath
      })

      this.files = {...this.files, [fileType]: tempFiles }

      specimenFilesTempStore.set(this.specimen.number, this.files)

      if (this.files.genome.length == 0 && this.files.report.length == 0) {
        specimenFilesTempStore.remove(this.specimen.number)
      }
    },
  },
}
</script>
