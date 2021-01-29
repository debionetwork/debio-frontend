<template>
  <div class="py-4">
    <v-row>
      <v-col cols="12" md="6">
        <template v-if="specimen.status == SUCCESS">
          <div class="secondary--text text-h6"><b>Genome Files</b></div>
        </template>
        <template v-else>
          <v-btn
            depressed
            color="primary"
            width="100%"
            @click="uploadGenome"
            :disabled="isLoading || !enabled"
            :loading="loading.genome"
            style="color: white;"
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
        </template>
      </v-col>
      <v-col cols="12" md="6">
        <template v-if="specimen.status == SUCCESS">
          <div class="secondary--text text-h6"><b>Report Files</b></div>
        </template>
        <template v-else>
          <v-btn
            depressed
            color="primary"
            width="100%"
            @click="uploadReport"
            :disabled="isLoading || !enabled"
            :loading="loading.report"
            style="color: white;"
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
        </template>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <div v-for="(file, idx) in files.genome" :key="idx + '-' + file.fileName + '-' + file.fileType">
          <FileCard :file="file" @delete="onFileDelete" :hideDelete="specimen.status == SUCCESS"/>
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <div v-for="(file, idx) in files.report" :key="idx + '-' + file.fileName + '-' + file.fileType">
          <FileCard :file="file" @delete="onFileDelete" :hideDelete="specimen.status == SUCCESS" />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import v from 'voca'
import cryptWorker from '../../../../../web-workers/crypt-worker'
import ipfsWorker from '../../../../../web-workers/ipfs-worker'
import sendTransaction from '../../../../../lib/send-transaction'
import specimenFilesTempStore from '../../../../../lib/specimen-files-temp-store'
import FileCard from './FileCard'
import { SENDING, RECEIVED, SUCCESS, REJECTED } from '@/constants/specimen-status'

export default {
  name: 'FileManager',
  components: {
    FileCard,
  },
  props: {
    enabled: Boolean,
    wallet: Object,
    specimen: Object,
  },
  computed: {
    isLoading() {
      return this.loading.genome || this.loading.report
    },
    ...mapState({
      degenicsContract: state => state.ethereum.contracts.contractDegenics
    }),
    genomeFiles() {
      return this.files.genome ?  [...this.files.genome] : []
    },
    reportFiles() {
      return this.files.report ? [...this.files.report] : []
    }
  },
  data: () => ({
    SENDING, RECEIVED, SUCCESS, REJECTED,
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
  watch: {
    genomeFiles(newState, oldState) {
      if (!newState) return
      if (oldState.length == 0 && newState.length > 0) {
        this.$emit('actionDone', 'Genome')
        return
      }
      if (oldState.length > 0 && newState.length == 0) {
        this.$emit('actionUnDone', 'Genome')
      }
    },
    reportFiles(newState, oldState) {
      if (!newState) return
      if (oldState.length == 0 && newState.length > 0) {
        this.$emit('actionDone', 'Report')
        return
      }
      if (oldState.length > 0 && newState.length == 0) {
        this.$emit('actionUnDone', 'Report')
      }
    }
  },
  mounted() {
    if (this.specimen.status == SUCCESS) {
      // Get files refernce from smart contract
      this.getFilesUploaded()
      return
    }
    // Add file input event listener
    this.addFileUploadEventListener(this.$refs.encryptUploadGenome, 'genome')
    this.addFileUploadEventListener(this.$refs.encryptUploadReport, 'report')
    // Get files stored locally
    this.getFilesFromTempStore()
  },
  methods: {
    uploadGenome() {
      this.$refs.encryptUploadGenome.click()
    },
    uploadReport() {
      this.$refs.encryptUploadReport.click()
    },
    /**
     * getFilesUploaded
     *
     * get the files reference from Blockchain
     * this will replace the local files state with the files state retrieved from Blockchain
     */
    async getFilesUploaded() {
      try {
        const address = this.specimen.owner;
        const arrFiles = await this.degenicsContract.methods
          .getFile(this.specimen.number).call({from: address});
        if (arrFiles) {
          const files = JSON.parse(arrFiles);
          const temp = {}
          files.forEach(file => {
            if (!(file.fileType in temp)) {
              temp[file.fileType] = []
            }
            temp[file.fileType].push(file)
          })

          this.files = temp
        }
      } catch (error) {
        console.error(error)
      }
    },
    /**
     * getFilesFromTempStore
     *
     * Get the files store on localstorage
     * Files are stored here if the processing is not yet finalized on the blockchain
     */
    getFilesFromTempStore() {
      let tempFiles = specimenFilesTempStore.get(this.specimen.number)
      if (!tempFiles) return
      // Load the files
      this.files = tempFiles
      // Emit actions (Genome, Report) done according to files that exists
      for (const [fileType, files] of Object.entries(tempFiles)) {
        this.files[fileType].concat(files)
        if (files.length > 0) {
          this.$emit('actionDone', v.titleCase(fileType))
        }
      }
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
            // Encrypt
            const encrypted = await context.encrypt({
              text: fr.result,
              fileType: file.fileType,
              fileName: file.name
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
            specimenFilesTempStore.set(context.specimen.number, context.files)

            context.loading[file.fileType] = false
          } catch (err) {
            console.log(err)
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
          const publicKey = this.specimen.pubkey;
          const arrChunks = [];
          let chunksAmount;

          cryptWorker.workerEncrypt.postMessage({ publicKey, text}) // Access this object in e.data in worker
          cryptWorker.workerEncrypt.onmessage = event => {
            // The first returned data is the chunksAmount
            if(event.data.chunksAmount) {
              chunksAmount = event.data.chunksAmount;
              return;
            }

            arrChunks.push(event.data)
            this.encryptProgress[fileType] = arrChunks.length / chunksAmount * 100;

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
    },
    /**
     * finalize
     *
     * Save the specimen state in blockchain:
     * - Set files references
     * - Set specimen status == Success
     */
    async finalize() {
      try {
        this.isLoading = true

        let files = []
        for (const [_, _files] of Object.entries(this.files)) {
          _
          files = files.concat(_files)
        }

        const abiData = this.degenicsContract.methods
          .analysisSucces(this.specimen.number, JSON.stringify(files), "Sucess")
          .encodeABI()
        let tx = await sendTransaction(
          this.degenicsContract._address, this.wallet, abiData
        )

        this.isLoading = false
        return { files, tx }
      } catch (err) {
        console.log('Error on finalizing to blockchain', err.message)
        this.isLoading = false
        throw new Error(err.message)
      }
    }
  }
}
</script>

<style>

</style>