<template>
    <div>
        <v-checkbox
            v-model="wetworkCheckbox"
            :disabled="wetworkCheckbox"
            @change="processDnaSample()"
            label="Wetwork is done"
        ></v-checkbox>
        <div class="d-flex justify-space-evenly">
            <v-btn
                class="mb-3 mr-3"
                style="width: 50%"
                color="primary"
                large
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
            <v-btn
                class="mb-3 mr-3"
                style="width: 50%"
                color="primary"
                large
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
                v-if="loading.genome"
                class="mt-2"
                indeterminate color="primary"
            />
        </div>
        <div class="d-flex justify-space-evenly">
            <v-btn
                class="mb-3 mr-3"
                style="width: 50%"
                color="primary"
                large
                :disabled="disableSendButton"
                @click="submitTestResult"
                >SEND</v-btn>
            <v-btn
                class="mb-3 mr-3"
                style="width: 50%; color: white;"
                color="yellow"
                large
                :disabled="disableRejectButton"
                @click="rejectDnaSample"
                >REJECT</v-btn>
        </div>
    </div>
</template>


<script>
import { mapGetters } from 'vuex'
import specimenFilesTempStore from '@/lib/specimen-files-temp-store'
import { processDnaSample, rejectDnaSample, submitTestResult } from '@/lib/polkadotProvider/command/geneticTesting'

export default {
  name: 'ProcessSpecimen',
  props: {
    specimenNumber: String,
  },
  data: () => ({
    wetworkCheckbox: false,
    genomeSucceed: false,
    reportSucceed: false,
    comment: "",
    reportLink: "",
    resultLink: "",
    isProcessSuccess: true,
    loading: {
      genome: '',
      report: '',
    },
    loadingStatus: {
      genome: '',
      report: '',
    },
  }),
  mounted(){
      console.log(this.disableRejectButton);
    // Add file input event listener
    // this.addFileUploadEventListener(this.$refs.encryptUploadGenome, 'genome')
    // this.addFileUploadEventListener(this.$refs.encryptUploadReport, 'report')
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
    async processDnaSample() {
      await processDnaSample(
        this.api,
        this.pair,
        this.specimenNumber,
      )
      this.$emit('processWetwork');
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
      this.$emit('sendData');
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
  },
}
</script>