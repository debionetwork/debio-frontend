<template>
  <v-dialog :value="_show" width="500" persistent>
    <v-card class="pb-5">
      <div v-if="filePending && !isLoading">
        <v-app-bar flat dense color="white">
          <v-toolbar-title class="title"> Upload EMR </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-app-bar>
        <hr />
        <div class="pl-5 pt-5 pr-5">
          <div class="align-center mb-5">Add File(s)</div>
          <div v-for="dataEMR in listPendingUploadFile" :key="dataEMR.title">
            <v-card
              class="dg-card pb-2 pt-2 mb-2"
              style="background: #ffffff"
              elevation="0"
              outlined
            >
              <div class="ml-5 mr-5">
                <v-row class="align-center">
                  <v-col cols="12" lg="11" md="11" xl="11">
                    <div class="align-center subtitle-2 emr-title">
                      {{ dataEMR.title }}
                    </div>
                  </v-col>
                </v-row>
                <div class="align-center caption mb-3 emr-description">{{ dataEMR.desc }}</div>
                <v-row class="align-center">
                  <v-col cols="12" lg="1" md="1" xl="1">
                    <v-icon :size="35" color="#BA8DBB">mdi-file-document</v-icon>
                  </v-col>
                  <v-col cols="12" lg="11" md="11" xl="11">
                    <div class="align-center caption">
                      <v-row class="align-center">
                        <v-col cols="12" lg="11" md="11" xl="11" class="d-flex flex-column">
                          <span class="caption emr-filename">{{ dataEMR.file.name }}</span>
                          <v-progress-linear v-if="isLoading" indeterminate color="primary"></v-progress-linear>
                          <span class="grey--text font-italic">
                            <span>Successfully uploaded</span>

                            <!-- <span class="primary--text">Failed to upload</span> -->
                          </span>
                        </v-col>
                        <v-col cols="12" lg="1" md="1" xl="1" class="align-center">
                          <v-icon @click="removePending(dataEMR)" :size="20">mdi-delete</v-icon>
                        </v-col>
                        <!-- <v-col cols="12" lg="1" md="1" xl="1" class="align-center">
                          <v-icon @click="reUploadFile(dataEMR)" color="primary" :size="20">mdi-rotate-left</v-icon>
                        </v-col> -->
                      </v-row>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </div>
          <v-card
            class="dg-card pb-2 pt-2"
            style="background: #ffffff"
            elevation="0"
            outlined
            @click="addFile()"
          >
            <div class="ml-5 mr-5">
              <div align="center" class="align-center mb-2">
                <v-icon color="#989898" class="align-center" :size="30">
                  mdi-plus
                </v-icon>
              </div>
              <div
                align="center"
                class="align-center mb-2"
                style="color: #989898; font-weight: bold"
              >
                Add File
              </div>
            </div>
          </v-card>

          <div class="mt-10">
            <v-btn
              depressed
              color="primary"
              large
              width="100%"
              @click="nextProcessEMR"
              :disabled="listPendingUploadFile.length < 1 || isLoading"
            >
              Next
            </v-btn>
          </div>
        </div>
      </div>

      <div v-if="openFormEMR && !isLoading">
        <v-app-bar flat dense color="white">
          <v-toolbar-title class="title"> Add EMR File </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeForm">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-app-bar>
        <hr />
        <div v-if="!isLoading" class="pl-5 pt-5 pr-5">
          <div class="mb-0">
            <v-text-field
              dense
              label="Title"
              outlined
              v-model="formTitle"
            ></v-text-field>
             <!-- placeholder="Title" -->
          </div>
          <div class="mb-2">
            <v-textarea
              v-model="formDescription"
              dense
              label="Description"
              outlined
              rows="3"
              row-height="25"
            ></v-textarea>
          </div>
          <div class="mb-2">
            <label>
              <input
                type="file"
                id="file"
                ref="file"
                v-on:change="setFiles()"
                accept="application/pdf"
              />
            </label>
          </div>
          <div class="mt-10">
            <v-btn
              depressed
              color="primary"
              large
              width="100%"
              @click="addToPending"
            >
              {{ checkAddCondition ? "Back" : "Add" }}
            </v-btn>
          </div>
        </div>
      </div>

      <div class="confim-file" v-if="openConfirmUpload && !isLoading">
        <div class="confim-file__dialog pl-5 pt-5 pr-5">
          <v-row>
            <v-col class="flex-column text-center">
              <img src="@/assets/debio-logo.png" alt="debio-logo" width="60px">
              <h4 class="confim-file__website grey--text">https://web-url.com</h4>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex justify-center">
              <h3 class="confim-file__message text-center">Are you sure you want to continue with the file(s)?</h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="confim-file__actions text-center">
              <v-btn
                width="147px"
                class="white--text"
                color="primary"
                raised
                elevation="5"
                @click="confimFile(true)"
              >
                Yes
              </v-btn>
              <v-btn
                width="147px"
                class="white--text"
                color="#BA8DBB"
                raised
                elevation="5"
                @click="confimFile(false)"
              >
                No
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </div>

      <div v-if="inputPassword">
        <v-app-bar flat dense color="white">
          <v-toolbar-title class="title"></v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeForm">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-app-bar>
        <div class="mt-2 mb-2 ml-10 mr-10">
          <div class="align-center">
            Please enter your password to encrypt the file (s)
          </div>
          <!-- Prompt password to sign transaction -->
          <v-text-field
            class="mt-2"
            outlined
            auto-grow
            type="password"
            @keyup.enter="onSubmit"
            v-model="password"
            label="Input your password"
            :disabled="isLoading"
          >
          </v-text-field>
          <v-progress-linear
            v-if="isLoading"
            indeterminate
            color="primary"
          ></v-progress-linear>
          <div class="">
            <v-btn
              depressed
              color="primary"
              large
              width="100%"
              @click="onSubmit"
              :disabled="!password || isLoading"
            >
              Continue
            </v-btn>
          </div>
        </div>
      </div>
      <div v-if="resultUpload && !isLoading" class="pb-5 pt-5">
        <div align="center" class="align-center mb-2">
          <v-icon :size="70" color="success">{{ uploadSuccessIcon }}</v-icon>
        </div>
        <div align="center" class="align-center mb-5">
          {{ uploadSuccessTitle }}
        </div>
        <div align="center" class="align-center">
          <v-btn
            depressed
            color="primary"
            large
            width="50%"
            @click="closeUploadSuccess"
          >
            Continue
          </v-btn>
        </div>
      </div>
      <div v-if="filePending && error" class="pb-5 pt-5 ml-10 mr-10">
        <v-alert dense text type="error">
          {{ error }}
        </v-alert>
      </div>
      <div v-else-if="filePending && loadingUploadText" class="pb-0 pt-5 ml-10 mr-10">
        <v-alert dense text type="info"> {{ loadingUploadText }} </v-alert>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex"
import ipfsWorker from "@/web-workers/ipfs-worker"
import cryptWorker from "@/web-workers/crypt-worker"
import { hexToU8a } from "@polkadot/util"
import {
  addElectronicMedicalRecordInfo,
  registerElectronicMedicalRecord,
} from "@/lib/polkadotProvider/command/electronicMedicalRecord"
import { queryGetEMRList } from "@/lib/polkadotProvider/query/electronicMedicalRecord"
import serviceHandler from "@/mixins/serviceHandler"

export default {
  name: "UploadEMR",
  mixins: [serviceHandler],

  props: {
    show: Boolean,
  },

  data: () => ({
    formTitle: "",
    formDescription: "",
    formFilePath: null,
    listPendingUploadFile: [],
    filePending: true,
    openFormEMR: false,
    openConfirmUpload: false,
    inputPassword: false,
    resultUpload: false,
    password: "",
    error: "",
    registerEMR: false,
    publicKey: null,
    uploadSuccessIcon: "mdi-check-circle",
    uploadSuccessTitle: "Upload Successful",
    secretKey: null,
    baseUrl: "https://ipfs.io/ipfs/",
    encryptProgress: 0,
    countFileUploaded: 0,
    fileType: "application/pdf",
    loadingUploadText: "",
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      lastEventData: (state) => state.substrate.lastEventData,
      mnemonicData: (state) => state.substrate.mnemonicData,
    }),

    _show: {
      get() {
        return this.show
      },
      set(val) {
        this.$emit("toggle", val)
      },
    },

    checkAddCondition() {
      return this.formFilePath == null || this.formTitle == '' || this.isLoading
    }
  },

  mounted() {
    this.initialData()
  },

  watch: {
    lastEventData() {
      if (this.lastEventData != null) {
        const dataEvent = JSON.parse(this.lastEventData.data.toString())
        if (this.lastEventData.method == "ElectronicMedicalRecordInfoAdded") {
          if (dataEvent[0].owner_id == this.wallet.address) {
            this.countFileUploaded = this.countFileUploaded + 1
            this.loadingUploadText =
              "Document EMR " + this.countFileUploaded + ": Saved"
            if (this.countFileUploaded == this.listPendingUploadFile.length) {
              this.isLoading = false
              this.inputPassword = false
              this.resultUpload = true
              this.error = ""
              this.loadingUploadText = ""
              this.countFileUploaded = 0
              this.listPendingUploadFile = []
            } else {
              this.handleFileUpload(
                this.listPendingUploadFile[this.countFileUploaded],
                this.countFileUploaded
              )
            }
          }
        } else if (
          this.lastEventData.method == "ElectronicMedicalRecordAdded"
        ) {
          if (
            dataEvent[0].owner_id == this.wallet.address &&
            this.registerEMR
          ) {
            this.prosesFiles()
          }
        }
      }
    },
  },

  methods: {
    ...mapMutations({
      setMetamaskAddress: "metamask/SET_WALLET_ADDRESS",
    }),

    initialData() {
      this.publicKey = hexToU8a(this.mnemonicData.publicKey)
      this.secretKey = hexToU8a(this.mnemonicData.privateKey)
    },

    addFile() {
      this.filePending = false
      this.openFormEMR = true
      this.formTitle = ""
      this.formDescription = ""
      this.formFilePath = null
    },

    setFiles() {
      this.formFilePath = this.$refs.file.files[0]
    },

    closeForm() {
      this.inputPassword = false
      this.filePending = true
      this.openFormEMR = false
      this.formTitle = ""
      this.formDescription = ""
      this.formFilePath = null
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

    async handleFileUpload(dataFile, index) {
      const file = dataFile.file
      const context = this
      const fr = new FileReader()
      fr.onload = async function () {
        try {
          // Upload
          const uploaded = await context.upload({
            encryptedFileChunks: dataFile.chunks,
            fileName: dataFile.fileName,
            fileType: dataFile.fileType,
            index: index,
            dataFile: dataFile,
          })

          const link = context.baseUrl + "" + context.getFileIpfsPath(uploaded)
          const dataBody = {
            title: dataFile.title,
            description: dataFile.desc,
            record_link: link,
          }
          await addElectronicMedicalRecordInfo(
            context.api,
            context.wallet,
            dataBody
          )
        } catch (err) {
          context.isLoading = false
          console.error(err)
        }
      }
      fr.readAsArrayBuffer(file)
    },

    encrypt({ text, fileType, fileName, index }) {
      this.loadingUploadText = "Document EMR " + (index + 1) + ": Encrypt"
      const typeFr = this.fileType
      const context = this
      const arrChunks = []
      let chunksAmount
      const pair = {
        secretKey: this.secretKey,
        publicKey: this.publicKey,
      }

      return new Promise((resolve, reject) => {
        try {
          cryptWorker.workerEncryptFile.postMessage({ pair, text, typeFr }) // Access this object in e.data in worker
          cryptWorker.workerEncryptFile.onmessage = async (event) => {
            if (event.data.chunksAmount) {
              chunksAmount = event.data.chunksAmount
              return
            }

            arrChunks.push(event.data)
            context.encryptProgress = (arrChunks.length / chunksAmount) * 100

            if (arrChunks.length == chunksAmount) {
              resolve({
                fileName: fileName,
                chunks: arrChunks,
                fileType: fileType,
              })
              // Cleanup
              context.encryptProgress = 0
              context.loadingUploadText =
                "Document EMR " + (index + 1) + ": Encrypted"
            }
          }
        } catch (err) {
          reject(new Error(err.message))
        }
      })
    },

    upload({ encryptedFileChunks, fileName, fileType, index }) {
      const chunkSize = 10 * 1024 * 1024 // 10 MB
      let offset = 0
      const data = JSON.stringify(encryptedFileChunks)
      const blob = new Blob([data], { type: this.fileType })
      this.loadingUploadText = "Document EMR " + (index + 1) + ": Uploading"
      return new Promise((resolve, reject) => {
        try {
          const fileSize = blob.size
          do {
            let chunk = blob.slice(offset, chunkSize + offset)
            ipfsWorker.workerUpload.postMessage({
              seed: chunk.seed,
              file: blob,
            })
            offset += chunkSize
          } while (chunkSize + offset < fileSize)

          let uploadSize = 0
          const uploadedResultChunks = []
          ipfsWorker.workerUpload.onmessage = async (event) => {
            uploadedResultChunks.push(event.data)
            uploadSize += event.data.data.size

            if (uploadSize >= fileSize) {
              resolve({
                fileName: fileName,
                fileType: fileType,
                ipfsPath: uploadedResultChunks,
              })

              this.loadingUploadText =
                "Document EMR " + (index + 1) + ": Uploaded"
            }
          }
        } catch (err) {
          reject(new Error(err.message))
        }
      })
    },

    async addToPending() {
      if (this.checkAddCondition) {
        this.closeForm()
        return
      }
      const file = this.formFilePath
      file.fileType = "application/pdf" // attach fileType to file, because fileType is not accessible in fr.onload scope
      const context = this
      const fr = new FileReader()
      fr.onload = async function () {
        try {
          const index = context.listPendingUploadFile.length
          const encrypted = await context.encrypt({
            text: fr.result,
            fileType: file.fileType,
            fileName: file.name,
            index: index,
          })
          const {
            chunks,
            fileName: encFileName,
            fileType: encFileType,
          } = encrypted

          context.listPendingUploadFile.push({
            title: context.formTitle,
            desc: context.formDescription,
            file: context.formFilePath,
            chunks: chunks,
            fileName: encFileName,
            fileType: encFileType,
          })
          context.closeForm()
        } catch (err) {
          context.isLoading = false
          console.error(err)
        }
      }
      fr.readAsArrayBuffer(file)
    },

    removePending(data) {
      const index = this.listPendingUploadFile
        .map(function (e) {
          return e.title
        })
        .indexOf(data.title)
      if (index > -1) {
        this.listPendingUploadFile.splice(index, 1)
      }
    },

    reUploadFile(data) {
      const index = this.listPendingUploadFile
        .map(function (e) {
          return e.title
        })
        .indexOf(data.title)
      if (index > -1) {
        this.listPendingUploadFile.splice(index, 1)
      }
    },

    nextProcessEMR() {
      this.openConfirmUpload = true
      this.filePending = false
    },

    confimFile(confirm) {
      this.filePending = true
      this.openConfirmUpload = false

      if (confirm) this.uploadEMRData()
    },

    uploadEMRData() {
      this.inputPassword = true
      this.filePending = false
      this.loadingUploadText = ""
    },

    async onSubmit() {
      this.isLoading = true
      this.error = ""
      this.loadingUploadText = ""
      try {
        this.wallet.decodePkcs8(this.password)
        if (this.listPendingUploadFile.length > 0) {
          const listEMR = await queryGetEMRList(this.api, this.wallet.address)
          if (listEMR == null) {
            this.registerEMR = true
            await registerElectronicMedicalRecord(this.api, this.wallet)
          } else {
            await this.prosesFiles()
          }
        } else {
          this.isLoading = false
          this.password = ""
          this.error = "no pending file"
        }
      } catch (e) {
        console.log(e)
        this.isLoading = false
        this.loadingUploadText = ""
        this.password = ""
        this.error = "The password you entered is wrong"
      }
    },

    async prosesFiles() {
      if (this.listPendingUploadFile.length > 0) {
        await this.handleFileUpload(this.listPendingUploadFile[0], 0)
      }
    },

    closeUploadSuccess() {
      this.$emit("status-upload", {
        status: true,
      })
      this.closeDialog()
    },

    closeDialog() {
      this._show = false
      this.listPendingUploadFile = []
      this.password = ""
      this.error = ""
      this.isLoading = false
      this.openFormEMR = false
      this.filePending = true
      this.inputPassword = false
      this.resultUpload = false
    }
  }
}
</script>

<style lang="scss">
  .emr {
    &-title,
    &-filename {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    &-description {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  .confim-file {
    &__message {
      max-width: 285px;
      margin-bottom: 27px;
    }

    &__actions {
      display: flex;
      gap: 0 61px;
      justify-content: center;
    }
  }
</style>
