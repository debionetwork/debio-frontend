<template>
  <div>
    <div v-if="submitted">
      <div class="d-flex mt-5 mb-5 justify-space-between">
        <v-row>
          <v-col>
            <div v-for="(file, idx) in files.genome" :key="idx + '-' + file.fileName + '-' + file.fileType">
              <FileCard :filename="file.fileName" :ipfsUrl="getFileIpfsUrl(file)"/>
            </div>
          </v-col>
        </v-row>
        <v-row class="ml-5">
          <v-col>
            <div v-for="(file, idx) in files.report" :key="idx + '-' + file.fileName + '-' + file.fileType">
              <FileCard :filename="file.fileName" :ipfsUrl="getFileIpfsUrl(file)" />
            </div>
          </v-col>
        </v-row>
      </div>
      <v-alert
          type="success"
          >Specimen Processed</v-alert>
    </div>
    <div v-else>
      <v-checkbox
          v-model="wetworkCheckbox"
          :disabled="wetworkCheckbox"
          @change="processDnaSample()"
          label="Wetwork is done"
      ></v-checkbox>
      <div class="d-flex justify-space-evenly">
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
            Upload Genome
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
            Upload Report
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
            @click="submitTestResult"
            >SEND</v-btn>
        </div>
        <div class="mb-3" style="width: 50%">
          <v-btn
            style="color: white"
            color="yellow"
            large
            block
            :disabled="disableRejectButton"
            @click="rejectDnaSample"
            >REJECT</v-btn>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
import FileCard from './FileCard'
import ipfsWorker from '@/web-workers/ipfs-worker'
import { naclSeal, mnemonicToMiniSecret, naclKeypairFromSeed } from '@polkadot/util-crypto'
import cryptWorker from '@/web-workers/crypt-worker'
import specimenFilesTempStore from '@/lib/specimen-files-temp-store'
import { processDnaSample, rejectDnaSample, submitTestResult } from '@/lib/polkadotProvider/command/geneticTesting'

export default {
  name: 'ProcessSpecimen',
  components: {
    FileCard,
  },
  props: {
    specimenNumber: String,
    publicKey: Uint8Array,
  },
  data: () => ({
    wetworkCheckbox: false,
    genomeSucceed: false,
    reportSucceed: false,
    comment: "",
    reportLink: "",
    resultLink: "",
    isProcessSuccess: true,
    submitted: false,
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
    }
  }),
  mounted(){
    // Add file input event listener
    this.addFileUploadEventListener(this.$refs.encryptUploadGenome, 'genome')
    this.addFileUploadEventListener(this.$refs.encryptUploadReport, 'report')
  },
  computed: {
    ...mapGetters({
      api: 'substrate/getAPI',
      pair: 'substrate/wallet',
    }),
    disableRejectButton(){
      return this.genomeSucceed && this.reportSucceed
    },
    disableSendButton(){
      return !this.disableRejectButton
    },
  },
  methods:{
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
    async processDnaSample() {
      await processDnaSample(
        this.api,
        this.pair,
        this.specimenNumber,
      )
      this.$emit('processWetwork')
    },
    async rejectDnaSample() {
      await rejectDnaSample(
        this.api,
        this.pair,
        this.specimenNumber,
      )
      this.$emit('rejectSpecimen')
    },
    async submitTestResult() {
      const genomeLink = this.getFileIpfsUrl(this.files.genome[0])
      const reportLink = this.getFileIpfsUrl(this.files.report[0])
      console.log(genomeLink, reportLink)
      await submitTestResult(
        this.api,
        this.pair,
        this.specimenNumber,
        this.isProcessSuccess,
        {
          comment: this.comment,
          report_link: reportLink,
          result_link: genomeLink
        }
      )
      this.submitted = true
      this.$emit('submitTestResult')
    },
    addFileUploadEventListener(fileInputRef, fileType) {
      const context = this
      fileInputRef.addEventListener('change', function() {
        const file = this.files[0]
        file.fileType = fileType // attach fileType to file, because fileType is not accessible in fr.onload scope
        const fr = new FileReader()
        fr.onload = async function() {
          try {
            context.loading[file.fileType] = true

            // // Encrypt
            // const encrypted = await context.encrypt({
            //   text: fr.result,
            //   fileType: file.fileType,
            //   fileName: file.name,
            // })
            // const { chunks, fileName: encFileName, fileType: encFileType } = encrypted
            // // Upload
            // const uploaded = await context.upload({
            //   encryptedFileChunks: chunks,
            //   fileType: encFileType,
            //   fileName: encFileName,
            // })

            // Upload
            const uploaded = await context.upload({
              encryptedFileChunks: fr.result,
              fileType: file.fileType,
              fileName: file.name,
            })
            const { fileName, fileType, ipfsPath } = uploaded
            context.files[fileType].push({ fileName, fileType, ipfsPath })

            // Save files to localStorage
            specimenFilesTempStore.set(context.specimenNumber, context.files)

            context.loading[file.fileType] = false

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
      this.loadingStatus[fileType] = 'Encrypting'

      return new Promise((resolve, reject) => {
        try {
          const publicKey = this.publicKey
          const buffer = new Uint8Array(text)
          
          // Create valid Substrate-compatible seed from mnemonic
          const seed = mnemonicToMiniSecret(this.mnemonic)

          // Generate new public/secret keypair for Alice from the supplied seed
          const keypair = naclKeypairFromSeed(seed)

          const sealedBuffer = naclSeal(buffer, keypair.secretKey, publicKey)

          const arrChunks = []
          let chunksAmount

          cryptWorker.workerEncrypt.postMessage({ publicKey, sealedBuffer }) // Access this object in e.data in worker
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

      return new Promise((resolve, reject) => {
        try {
          for (let chunk of encryptedFileChunks) {
            const data = JSON.stringify(chunk)
            const blob = new Blob([ data ], { type: 'text/plain' })
            ipfsWorker.workerUpload.postMessage({
              seed: chunk.seed, file: blob
            })
          }

          const uploadedResultChunks = []
          ipfsWorker.workerUpload.onmessage = async event => {
            uploadedResultChunks.push(event.data)
            this.uploadProgress[fileType] =
              uploadedResultChunks.length / encryptedFileChunks.length * 100

            if (uploadedResultChunks.length == encryptedFileChunks.length) {
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