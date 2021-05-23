<style scoped>
.card-header{
    font-size: 14pt;
}
</style>

<template>
   <div>
      <v-container>
        <v-row>
            <v-col cols="10" md="3">
                <v-card class="dg-card" elevation="0" outlined>
                    <v-card-text class="px-8 mt-5">
                    <div class="secondary--text mb-8 card-header">
                        <b>Checklist</b>
                    </div>
                    <v-checkbox
                        v-model="receiveDnaSampleCheckbox"
                        label="Received"
                        disabled
                    ></v-checkbox>
                    <v-checkbox
                        v-model="wetworkCheckbox"
                        label="Wetwork"
                        disabled
                    ></v-checkbox>
                    <v-checkbox
                        v-model="uploadedGenomeCheckbox"
                        label="Genome"
                        disabled
                    ></v-checkbox>
                    <v-checkbox
                        v-model="uploadedReportCheckbox"
                        label="Report"
                        disabled
                    ></v-checkbox>
                    <v-checkbox
                        v-model="resultSubmittedCheckbox"
                        label="Sent"
                        disabled
                    ></v-checkbox>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="10" md="7">
                <v-card class="dg-card" elevation="0" outlined>
                    <v-card-text class="px-8 mt-5">
                        <div class="d-flex mb-8 justify-space-between">
                            <b class="secondary--text card-header">Order Detail</b>
                            <b class="secondary--text h6">{{ this.createdAt }}</b>
                        </div>
                        <div class="d-flex justify-space-between">
                            <div class="d-flex align-center">
                                <div>
                                    <v-icon color="#BA8DBB" :size="52">
                                        mdi-pill
                                    </v-icon>
                                </div>
                                <div class="ml-5">
                                    <div class="text-h6">
                                        <b>Supplement</b>
                                    </div>
                                    <div class="text-caption grey--text text--darken-1">
                                        Supplement recommendation based on your genes
                                    </div>
                                </div>
                            </div>
                            <div class="mt-2 ml-5" style="max-width: 50%;">
                                <div class="h6">
                                    <b>Customer Account Number</b>
                                </div>
                                <div class="text-caption grey--text text--darken-1">
                                    {{ this.customerEthAddress }}
                                </div>
                            </div>
                        </div>
                        <div class="mt-6 d-flex justify-space-between">
                            <div class="mt-2 ml-5" style="max-width: 50%;">
                                <div class="h6">
                                    <b>Specimen Number</b>
                                </div>
                                <div class="text-caption grey--text text--darken-1">
                                    {{ this.specimenNumber }}
                                </div>
                            </div>
                            <div class="mt-2 ml-5" style="max-width: 50%;">
                                <div class="h6">
                                    <b>Escrow Address</b>
                                </div>
                                <div class="text-caption grey--text text--darken-1">
                                    {{ this.sellerEthAddress }}
                                </div>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
                <v-card v-if="showConfirmSpecimenDialog" class="dg-card mt-5" elevation="0" outlined>
                    <v-card-text class="px-8 mt-5">
                        <v-form
                            ref="form"
                            v-model="valid"
                            class="d-flex"
                        >
                            <v-text-field
                                dense
                                label="Confirm Specimen Number"
                                placeholder="Confirm Specimen Number"
                                outlined
                                :rules="[confirmSpecimenNumberRule(specimenNumber)]"
                                v-model="confirmSpecimenNumber"
                            ></v-text-field>

                            <v-btn
                                class="ml-5"
                                style="width: 35%"
                                color="primary"
                                large
                                @click="receiveDnaSample"
                            >RECEIVE SPECIMEN</v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
                <div v-if="showUploadGenomeReportDialog">
                    <v-checkbox
                        :disabled="wetworkCheckbox == true"
                        v-model="wetworkCheckbox"
                        label="Wetwork is done"
                        @click="processDnaSample"
                    ></v-checkbox>
                    <div class="d-flex justify-space-evenly">
                        <v-btn
                            class="mb-3 mr-3"
                            style="width: 50%"
                            color="primary"
                            large
                            @click="uploadGenomeToIpfs"
                        >
                            <v-icon left>
                            mdi-dna
                            </v-icon>
                            <v-spacer />
                            UPLOAD GENOME
                            <v-spacer />
                            <v-icon 
                                v-if="uploadedGenomeCheckbox"
                                right 
                                color="teal accent-2"
                            >
                            mdi-check-circle
                            </v-icon>
                        </v-btn>
                        <v-btn
                            class="mb-3 mr-3"
                            style="width: 50%"
                            color="primary"
                            large
                            @click="uploadReportToIpfs"
                        >
                            <v-icon left>
                            mdi-file-document-multiple-outline
                            </v-icon>
                            <v-spacer />
                            UPLOAD REPORT
                            <v-spacer />
                            <v-icon 
                                v-if="uploadedReportCheckbox"
                                right 
                                color="teal accent-2"
                            >
                            mdi-check-circle
                            </v-icon>
                        </v-btn>
                    </div>
                    <div class="d-flex justify-space-evenly">
                        <v-btn
                            class="mb-3 mr-3"
                            style="width: 50%"
                            color="primary"
                            large
                            :disabled="uploadedGenomeCheckbox == false || uploadedReportCheckbox == false"
                            @click="submitTestResult"
                        >SEND</v-btn>
                        <v-btn
                            class="mb-3 mr-3"
                            style="width: 50%"
                            color="primary"
                            large
                            :disabled="uploadedGenomeCheckbox == true && uploadedReportCheckbox == true"
                            @click="rejectDnaSample"
                        >REJECT</v-btn>
                    </div>
                </div>
                <div v-if="showResultDialog">
                    <div class="d-flex mb-8 mt-4 justify-space-between">
                        <div style="width: 50%;">
                            <b class="secondary--text card-header">Genome Files</b>
                            <v-card class="d-flex pa-2 justify-space-between">
                                <b>Genome.txt</b>
                                <v-icon>
                                    mdi-eye
                                </v-icon>
                            </v-card>
                        </div>
                        <div class="ml-5" style="width: 50%;">
                            <b class="secondary--text card-header">Report Files</b>
                            <v-card class="d-flex pa-2 justify-space-between">
                                <b>Report.txt</b>
                                <v-icon>
                                    mdi-eye
                                </v-icon>
                            </v-card>
                        </div>
                    </div>
                    <v-alert
                        type="success"
                        >Specimen Processed</v-alert>
                </div>
            </v-col>
        </v-row>
      </v-container>
   </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ipfsWorker from '@/web-workers/ipfs-worker'
import { processDnaSample, receiveDnaSample, rejectDnaSample, submitTestResult } from '@/lib/polkadotProvider/command/geneticTesting'

export default {
  name: 'ProcessOrderHistory',
  data: () => ({
    receiveDnaSampleCheckbox: false,
    wetworkCheckbox: false,
    uploadedGenomeCheckbox: false,
    uploadedReportCheckbox: false,
    resultSubmittedCheckbox: false,
    genomeFiles: [],
    reportFiles: [],
    valid: "",
    comment: "",
    reportLink: "",
    resultLink: "",
    isProcessSuccess: true,
    customerEthAddress: "",
    sellerEthAddress: "",
    createdAt: "",
    specimenNumber: "",
    confirmSpecimenNumber: "",
    confirmSpecimenNumberRule: (password) => (val) =>
        (!!password && password == val) || "Specimen number must match.",
  }),
  mounted(){
    this.pair.unlock('yo230899')
    this.createdAt = this.$route.params.item.created_at
    this.customerEthAddress = this.$route.params.item.customer_eth_address
    this.sellerEthAddress = this.$route.params.item.seller_eth_address
    this.specimenNumber = this.$route.params.item.dna_sample_tracking_id
  },
  computed: {
    ...mapGetters({
      api: 'substrate/getAPI',
      pair: 'substrate/wallet',
    }),
    showConfirmSpecimenDialog(){
        return this.receiveDnaSampleCheckbox == false
    },
    showUploadGenomeReportDialog(){
        return this.receiveDnaSampleCheckbox == true && this.resultSubmittedCheckbox == false
    },
    showResultDialog(){
        return this.resultSubmittedCheckbox == true
    },
  },
  methods:{
    async receiveDnaSample() {
      this.$refs.form.validate()
      if(this.valid){
        await receiveDnaSample(
            this.api,
            this.pair,
            this.specimenNumber,
        )
        this.receiveDnaSampleCheckbox = true
      }
    },
    async processDnaSample() {
      await processDnaSample(
        this.api,
        this.pair,
        this.specimenNumber,
      )
    },
    async rejectDnaSample() {
      await rejectDnaSample(
        this.api,
        this.pair,
        this.specimenNumber,
      )
    },
    async submitTestResult() {
      await submitTestResult(
        this.api,
        this.pair,
        this.specimenNumber,
        this.isProcessSuccess,
        {
          comment: this.comment,
          report_link: this.reportLink,
          result_link: this.resultLink
        }
      )
      this.resultSubmittedCheckbox = true
    },
    uploadGenomeToIpfs() {
      const fileType = this.fileType
      const objEncrypted = this.genomeFiles
      
      // For each objEncrypted object upload using IPFS worker
      for (let file of objEncrypted) {
        const data = JSON.stringify(file)
        const blob = new Blob([ data ], {type: 'text/plain'})
        ipfsWorker.workerUpload.postMessage({seed: file.seed, file: blob}) // Access this object in e.data in worker
      }

      // Listen and track upload
      let uploadedFiles = []
      ipfsWorker.workerUpload.onmessage = async event => {
        uploadedFiles.push(event.data)
        this.uploadProgress = uploadedFiles.length / objEncrypted.length * 100

        if (uploadedFiles.length == objEncrypted.length) {
          const fileName = this.fileName
          this.files.push({
            fileName,
            fileType,
            ipfsPath: uploadedFiles,
          })
          this.genomeFiles = []
          this.fileType = null
          this.uploadedGenomeCheckbox = true
        }
      }
    },
    uploadReportToIpfs() {
      const fileType = this.fileType
      const objEncrypted = this.reportFiles
      
      // For each objEncrypted object upload using IPFS worker
      for (let file of objEncrypted) {
        const data = JSON.stringify(file)
        const blob = new Blob([ data ], {type: 'text/plain'})
        ipfsWorker.workerUpload.postMessage({seed: file.seed, file: blob}) // Access this object in e.data in worker
      }

      // Listen and track upload
      let uploadedFiles = []
      ipfsWorker.workerUpload.onmessage = async event => {
        uploadedFiles.push(event.data)
        this.uploadProgress = uploadedFiles.length / objEncrypted.length * 100

        if (uploadedFiles.length == objEncrypted.length) {
          const fileName = this.fileName
          this.files.push({
            fileName,
            fileType,
            ipfsPath: uploadedFiles,
          })
          this.reportFiles = []
          this.fileType = null
          this.uploadedReportCheckbox = true
        }
      }
    },
  },
}
</script>