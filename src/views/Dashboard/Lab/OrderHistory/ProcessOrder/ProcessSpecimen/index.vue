<template>
  <div>
    <template>
      <DialogErrorBalance
        :show="isShowError"
        @close="closeDialog"
      />
      <v-file-input
        :rules="genomeFileRules"
        @change="addFileUploadEventListener($event, 'genome')"
        style="display: none"
        ref="encryptUploadGenome"
        accept=".vcf"
      />
      <div v-if="hasGenomeFile" class="d-flex mt-5 mb-5">
        <v-row >
          <v-col>
            <b class="secondary--text card-header mb-2" style="display: block">VCF Data</b>
            <div v-for="(file, idx) in files.genome" :key="idx + '-' + file.fileName + '-' + file.fileType">
              <FileCard
                :filename="file.fileName"
                :ipfsUrl="file.ipfsPath"
                :view-only="submitted"
                @edit="onEditClick('genome')"
                @delete="onFileDelete('genome')"
              />
            </div>
          </v-col>
        </v-row>
      </div>
      <div v-else class="mb-3 mt-3">
        <div class= "d-flex justify-space-between">
          <div class="mb-5 mt-5">
            <span
              style="font-size: 12px"
            > Estimated Transaction Weight </span>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    color="primary"
                    size="14"
                    v-bind="attrs"
                    v-on="on"
                  > mdi-alert-circle-outline
                  </v-icon>
                </template>
                <span style="font-size: 10px;">Total fee paid in DBIO to execute this transaction.</span>
              </v-tooltip>
          </div>
          <div class="mt-5">
            <span style="font-size: 12px;">
              {{ Number(fee).toFixed(4) }} DBIO
            </span>
          </div>
        </div>

        <v-btn
          color="primary"
          large
          block
          :disabled="uploadGenomeDisabled"
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
      <span class="primary--text small">{{hasGenomeError[0]}}</span>
      <v-progress-linear
        v-if="loading.genome"
        class="mt-2"
        indeterminate color="primary"
      />
    </template>

    <template>
      <v-file-input
        :rules="reportFileRules"
        @change="addFileUploadEventListener($event, 'report')"
        style="display: none"
        ref="encryptUploadReport"
        accept="application/pdf"
      />
      <div v-if="hasReportFile" class="d-flex mt-5 mb-5">
        <v-row >
          <v-col>
            <b class="secondary--text card-header mb-2" style="display: block">Report Files</b>
            <div v-for="(file, idx) in files.report" :key="idx + '-' + file.fileName + '-' + file.fileType">
              <FileCard
                :filename="file.fileName"
                :ipfsUrl="file.ipfsPath"
                :view-only="submitted"
                @edit="onEditClick('report')"
                @delete="onFileDelete('report')"
              />
            </div>
          </v-col>
        </v-row>
      </div>
      <div v-else class="mb-3">
        <div class= "d-flex justify-space-between" v-if="!uploadReportDisabled">
          <div class="mb-5 mt-5">
            <span
              style="font-size: 12px"
            > Estimated Transaction Weight </span>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    color="primary"
                    size="14"
                    v-bind="attrs"
                    v-on="on"
                  > mdi-alert-circle-outline
                  </v-icon>
                </template>
                <span style="font-size: 10px;">Total fee paid in DBIO to execute this transaction.</span>
              </v-tooltip>
          </div>
          <div class="mt-5">
            <span style="font-size: 12px;">
              {{ Number(fee).toFixed(4) }} DBIO
            </span>
          </div>
        </div>
        <v-btn
          color="primary"
          large
          block
          :disabled="uploadReportDisabled"
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
      <span class="primary--text small">{{hasReportError[0]}}</span>
      <v-progress-linear
        v-if="loading.report"
        class="mt-2"
        indeterminate color="primary"
      />
    </template>

    <div v-if="sendReportButtonVisible" class="mb-3">
      <v-btn
        color="primary"
        large
        block
        class="mt-6"
        :disabled="isLoading"
        @click="showConfirmationDialog"
      >
        Submit Result
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

    <Dialog :show="confirmationDialog" @close="confirmationDialog = false">
      <template v-slot:title>
          <div></div>
      </template>
      <template v-slot:body>
          <div class="d-flex justify-center pb-5 pt-5">
              <v-img v-bind:src="require('@/assets/debio-logo.png')" max-width="50" />
          </div>
          <div align="center" class="pb-5">Are you sure you want to submit the results?</div>
          <div class= "d-flex justify-space-between px-5">
            <div class="mt-5">
              <span
                style="font-size: 12px"
              > Estimated Transaction Weight </span>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      color="primary"
                      size="14"
                      v-bind="attrs"
                      v-on="on"
                    > mdi-alert-circle-outline
                    </v-icon>
                  </template>
                  <span style="font-size: 10px;">Total fee paid in DBIO to execute this transaction.</span>
                </v-tooltip>
            </div>
            <div class="mt-5">
              <span style="font-size: 12px;">
                {{ Number(fee).toFixed(4) }} DBIO
              </span>
            </div>
          </div>
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
import { mapGetters, mapState } from "vuex"
import serviceHandler from "@/mixins/serviceHandler"
import FileCard from "./FileCard"
import cryptWorker from "@/web-workers/crypt-worker"
import Kilt from "@kiltprotocol/sdk-js"
import CryptoJS from "crypto-js"
import { fulfillOrder } from "@/lib/polkadotProvider/command/orders"
import DialogAlert from "@/components/Dialog/DialogAlert"
import Dialog from "@/components/Dialog"
import { u8aToHex } from "@polkadot/util"
import Button from "@/components/Button"
import { uploadFile, getFileUrl, getIpfsMetaData } from "@/lib/pinata-proxy"
import { submitTestResult, processDnaSample, submitTestResultFee, processDnaSampleFee } from "@/lib/polkadotProvider/command/geneticTesting"
import { queryDnaTestResults } from "@/lib/polkadotProvider/query/geneticTesting"
import localStorage from "@/lib/local-storage"
import DialogErrorBalance from "@/components/Dialog/DialogErrorBalance"
import { getRequestByOrderId } from "@/lib/polkadotProvider/query/service-request"
import { finalizeServiceRequest } from "@/lib/polkadotProvider/command/service-request"


export default {
  name: "ProcessSpecimen",

  components: {
    FileCard,
    DialogAlert,
    Dialog,
    DialogErrorBalance,
    Button
  },

  mixins: [serviceHandler],

  props: {
    isSubmitted: Boolean,
    orderId: String,
    specimenNumber: String,
    specimenStatus: String,
    publicKey: [Uint8Array, String]
  },

  data: () => ({
    identity: null,
    genomeSucceed: false,
    reportSucceed: false,
    hasGenomeError: [],
    hasReportError: [],
    genomeUploadSucceedDialog: false,
    reportUploadSucceedDialog: false,
    confirmationDialog: false,
    fee: 0,
    comment: "",
    reportLink: "",
    resultLink: "",
    submitted: false,
    isProcessed: false,
    isShowError: false,
    files: {
      genome: [],
      report: []
    },
    loading: {
      genome: false,
      report: false
    },
    loadingStatus: {
      genome: "",
      report: ""
    },
    encryptProgress: {
      genome: 0,
      report: 0
    },
    uploadProgress: {
      genome: 0,
      report: 0
    }
  }),

  async mounted(){
    await this.getFee()

    const testResult = await queryDnaTestResults(this.api, this.specimenNumber)
    if(testResult) this.setUploadFields(testResult)

    this.submitted = this.isSubmitted
  },

  computed: {
    ...mapGetters({
      api: "substrate/getAPI",
      pair: "substrate/wallet"
    }),

    ...mapState({
      mnemonic: state => state.substrate.mnemonicData,
      web3: state => state.metamask.web3,
      lastEventData: (state) => state.substrate.lastEventData
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
    },

    uploadGenomeDisabled() {
      return this.loading.genome || this.loading.report || this.genomeSucceed
    },

    uploadReportDisabled() {
      return !this.hasGenomeFile || this.loading.genome || this.loading.report || this.reportSucceed;
    },

    sendReportButtonVisible() {
      return this.hasGenomeFile && this.hasReportFile && !this.submitted
    },

    genomeFileRules() {
      return [
        value => !value || value.type == "text/x-vcard" || value.type == "text/vcard" || value.type == "text/directory" || "The files uploaded are not in the supported file formats (VCF)",
        value => !value || value.size < 2000000 || "The total file size uploaded exceeds the maximum file size allowed (2MB)"
      ]
    },
    reportFileRules() {
      return [
        value => !value || value.type == "application/pdf" || "The files uploaded are not in the supported file formats (PDF)",
        value => !value || value.size < 2000000 || "The total file size uploaded exceeds the maximum file size allowed (2MB)"
      ]
    }
  },

  created() {
    if (this.mnemonic) this.initialData()
  },

  watch: {
    mnemonic(val) {
      if (val) this.initialData()
    },

    async lastEventData(e) {
      const dataEvent = JSON.parse(e.data.toString())
      if (dataEvent[0].sellerId === this.pair.address) {
        if (e.method === "OrderFulfilled" && dataEvent[0].orderFlow === "StakingRequestService" ){
          await this.finalizeOrder(dataEvent[0].id)
        }
      }
    }
  },

  methods:{
    initialData() {
      this.identity = Kilt.Identity.buildFromMnemonic(this.mnemonic.toString(CryptoJS.enc.Utf8))
    },

    async setUploadFields(testResult){
      const { resultLink, reportLink } = testResult
      const metadata = async (cid, documentType) => {
        this.loading[documentType] = true
        const { rows } = await getIpfsMetaData(cid)
        this.loading[documentType] = false

        return rows[0].metadata.name
      }

      if(resultLink){
        const genomeFile = {
          fileName: await metadata(resultLink.split("/").pop(), "genome"),
          ipfsPath: resultLink
        }
        this.files.genome.push(genomeFile)
      }
      if(reportLink){
        const reportFile = {
          fileName: await metadata(reportLink.split("/").pop(), "report"),
          ipfsPath: reportLink
        }
        this.files.report.push(reportFile)
      }
    },

    uploadGenome() {
      this.$refs.encryptUploadGenome.$refs.input.click()
    },

    uploadReport() {
      this.$refs.encryptUploadReport.$refs.input.click()
    },

    async getFee() {
      const fee = await submitTestResultFee(this.api, this.pair, this.specimenNumber)
      this.fee = this.web3.utils.fromWei(String(fee.partialFee), "ether")
    },

    async submitTestResultDocument(callback = () => {}) {
      try {
        await submitTestResult(
          this.api,
          this.pair,
          this.specimenNumber,
          {
            comment: this.comment,
            reportLink: this.files.report[0]?.ipfsPath || "",
            resultLink: this.files.genome[0]?.ipfsPath || ""
          },
          callback
        )
        this.$emit("resultUploaded")
      } catch (err) {
        if (err.message === "1010: Invalid Transaction: Inability to pay some fees , e.g. account balance too low") {
          this.isShowError = true
        }
      }
    },

    async sendTestResult() {
      try {
        this.isLoading = true
        await processDnaSample(
          this.api,
          this.pair,
          this.specimenNumber,
          "ResultReady",
          async () => {
            await this.resultReady()
          }
        )
      } catch (err) {
        this.isLoading = false
        if (err.message === "1010: Invalid Transaction: Inability to pay some fees , e.g. account balance too low") {
          this.isShowError = true
        }
      }
    },

    async showConfirmationDialog() {
      const fee = await processDnaSampleFee(this.api, this.pair, this.specimenNumber, "ResultReady")
      this.fee = this.web3.utils.fromWei(String(fee.partialFee), "ether")

      this.confirmationDialog = true
    },
    
    async resultReady() {
      this.isProcessing = true
      await this.dispatch(
        fulfillOrder,
        this.api,
        this.pair,
        this.orderId,
        () => {
          this.isLoading = false
          this.confirmationDialog = false
          this.submitted = true
          this.$emit("resultReady")
        }
      )
      this.sendingNotification()
    },

    async finalizeOrder(id) {
      const requestId = await getRequestByOrderId(this.api, id)
      await finalizeServiceRequest(this.api, this.pair, requestId)
    },

    addFileUploadEventListener(fileInputRef, fileType) {
      this.hasGenomeError = []
      this.hasReportError = []

      if (fileType === "genome") this.genomeFileRules.forEach(rule => {
        const resultRule = rule.call(this, fileInputRef)

        if (typeof resultRule === "string") this.hasGenomeError.push(resultRule)
      })
      if (fileType === "report") this.reportFileRules.forEach(rule => {
        const resultRule = rule.call(this, fileInputRef)

        if (typeof resultRule === "string") this.hasReportError.push(resultRule)
      });
      const context = this

      if (this.hasGenomeError.length && fileType === "genome" || this.hasReportError.length && fileType === "report") return

      context.loading[fileType] = true
      const file = fileInputRef
      file.fileType = fileType // attach fileType to file, because fileType is not accessible in fr.onload scope
      const fr = new FileReader()
      fr.onload = async function() {
        try {
          // Encrypt
          const encrypted = await context.encrypt({
            text: fr.result,
            fileType: file.fileType,
            fileName: file.name,
            fileSize: file.size
          })

          const { chunks, fileName: encFileName, fileType: encFileType, fileSize } = encrypted
          // Upload
          const uploaded = await context.upload({
            encryptedFileChunks: chunks,
            fileName: encFileName,
            documentType: encFileType,
            type: file.type,
            fileSize
          })

          // files is array, but currently only support storing 1 file for each type

          if (context.files[fileType].length > 0) {
            context.files[fileType][0] = { fileName: file.name, fileType, ipfsPath: uploaded }
          } else {
            context.files[fileType].push({ fileName: file.name, fileType, ipfsPath: uploaded })
          }

          context.loading[file.fileType] = false

          // Emit finish
          if(file.fileType == "genome") {
            context.genomeSucceed = true
            context.genomeUploadSucceedDialog = true
            context.$emit("uploadGenome")

            context.submitTestResultDocument(() => {
              context.loading[file.fileType] = false
            })
          }
          if(file.fileType == "report") {
            context.reportSucceed = true
            context.reportUploadSucceedDialog = true
            context.$emit("uploadReport")

            context.submitTestResultDocument(() => {
              context.loading[file.fileType] = false
            })
          }
        } catch (err) {
          console.error(err)
        }
      }
      fr.readAsArrayBuffer(file)
    },

    encrypt({ text, fileType, fileName }) {
      const context = this
      this.loadingStatus[fileType] = "Encrypting"

      return new Promise((resolve, reject) => {
        try {
          const pair = {
            secretKey: u8aToHex(context.identity.boxKeyPair.secretKey),
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
              this.loadingStatus[fileType] = ""
            }
          }

        } catch (err) {
          reject(new Error(err.message))
        }
      })
    },

    async upload({ encryptedFileChunks, fileName, documentType, type, fileSize }) {
      this.loadingStatus[documentType] = "Uploading"
      const data = JSON.stringify(encryptedFileChunks)
      const blob = new Blob([ data ], { type })

      const result = await uploadFile({
        title: fileName,
        type: type,
        size: fileSize,
        file: blob
      })

      const link = getFileUrl(result.IpfsHash)

      this.uploadProgress[documentType] = 0
      this.loadingStatus[documentType] = ""

      return link
    },

    onEditClick(fileType) {
      if (fileType == "genome") this.uploadGenome()
      if (fileType == "report") this.uploadReport()
    },

    onFileDelete(fileType) {
      this.files[fileType] = []
      if (fileType == "genome") {
        this.genomeSucceed = false
        this.$refs.encryptUploadGenome.value = null
      }
      if (fileType == "report") {
        this.reportSucceed = false
        this.$refs.encryptUploadReport.value = null
      }
    },

    closeDialog() {
      this.isShowError = false
      this.isLoading = false
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
        minute: "numeric"
      });

      const notification = {
        message: "Congrats! You got 5 DBIO!",
        timestamp: timestamp,
        data: "",
        route: "result-test",
        params: "",
        read: false,
        notifDate: notifDate
      }

      listNotification.push(notification)
      localStorage.setLocalStorageByName(storageName, JSON.stringify(listNotification));
      listNotification.reverse();
    }
  }
}
</script>

<style scoped>
.confirmation-background{
    background: #E6E6E6;
}
</style>
