<template>
  <div>
    <v-container>
      <h3
        v-if="!documentsHistory.length"
        class="font-weight-regular">You don’t have any EMR document yet.
      </h3>
      <v-row>
        <v-col>
          <!-- :sort-by="['timestamp']" -->
          <DataTable
            :class="{ 'hidetable': !documentsHistory.length }"
            :headers="headers"
            :items="documentsHistory"
            :search="search"
            :sort-desc="[true]"
            :loading="isLoading"
            additional-class="laporan-table"
          >
            <template v-slot:search-bar>
              <SearchBar
                label="Search"
                @input="onSearchInput"
              ></SearchBar>
            </template>
            <!-- <template v-slot:[`item.dna_sample_tracking_id`]="{ item }">
              {{ timestamp | timestampToDateTime }}
            </template>
             -->

            <template v-slot:[`item.actions`]="{ item }">
              <v-container v-if="item.data.record_link != ''">
                <div class="d-flex align-center">
                  <v-btn icon @click="goToDetail(item)">
                    <v-icon color="grey">mdi-eye</v-icon>
                  </v-btn>
                  <v-btn icon @click="downloadFile(item)">
                    <v-icon color="grey">mdi-download</v-icon>
                  </v-btn>
                  <v-btn icon @click="confirmRemoveEMR(item)">
                    <v-icon color="grey">mdi-delete</v-icon>
                  </v-btn>
                </div>
              </v-container>
            </template>
            <!-- Rows -->
          </DataTable>
        </v-col>
      </v-row>
      <v-row class="pt-5">
        <v-dialog :value="showDialogUseTypeFile" width="500" persistent>
          <v-card class="pb-5">
            <v-app-bar flat dense color="white">
              <v-toolbar-title class="title">
                Select Document Type
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon @click="showDialogUseTypeFile = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-app-bar>
            <hr />
            <div class="pt-5 pb-5 pl-5 pr-5">
              <v-card
                class="dg-card pb-2 pt-2 mb-4"
                style="background: #eeeeee"
                elevation="0"
                outlined
                @click="openUpload('emr')"
              >
                <div class="ml-5 mr-5">
                  <v-row class="align-center">
                    <v-col cols="12" lg="2" md="2" xl="2">
                      <v-icon color="#BA8DBB" :size="48">
                        mdi-file-document
                      </v-icon>
                    </v-col>
                    <v-col cols="12" lg="10" md="10" xl="10">
                      <div class="ml-3 text-left font-weight-bold">
                        Electronic Medical Record
                      </div>
                      <div class="ml-3 text-left">EMR</div>
                    </v-col>
                  </v-row>
                </div>
              </v-card>
              <v-tooltip top max-width="350">
                <template v-slot:activator="{ on, attrs }">
                  <v-card
                    v-on="on"
                    v-bind="attrs" 
                    class="dg-card pb-2 pt-2"
                    style="background: #eeeeee"
                    elevation="0"
                    outlined
                    @click="openUpload('other')"
                  >
                    <div class="ml-5 mr-5">
                      <v-row class="align-center">
                        <v-col cols="12" lg="2" md="2" xl="2">
                          <v-icon color="#BA8DBB" :size="48">
                            mdi-file-document
                          </v-icon>
                        </v-col>
                        <v-col cols="12" lg="10" md="10" xl="10">
                          <div class="ml-3 text-left font-weight-bold">Others</div>
                          <div class="ml-3 text-left"></div>
                        </v-col>
                      </v-row>
                    </div>
                  </v-card>
                </template>
                Under Development
              </v-tooltip>
            </div>
          </v-card>
        </v-dialog>

        <v-col lg="12" md="12" sm="12">
          <Button @click="useTypeUpload" elevation="2" dark>
            {{ computeUploadText }}
          </Button>
        </v-col>
      </v-row>

      <DialogConfirmWithPassword
        :show="confirmDeleteEMR"
        :title="'Delete Data EMR'"
        :contentText="'Are you sure you want to delete this emr ?'"
        :buttonTitle="'Continue'"
        @toggle="confirmDeleteEMR = $event"
        @status-confirm="({ status }) => removeEMRData(status)"
      ></DialogConfirmWithPassword>
      <DialogLoading
        :show="showDialogLoading"
        @toggle="showDialogLoading = $event"
      ></DialogLoading>
      <UploadEMR
        :show="uploadEMR"
        @toggle="uploadEMR = $event"
        @status-upload="({ status }) => uploadSuccess(status)"
      ></UploadEMR>
    </v-container>
  </div>
</template>

<script>
import { mapState } from "vuex"
import DataTable from "@/components/DataTable"
import SearchBar from "@/components/DataTable/SearchBar"
import DialogConfirmWithPassword from "@/components/Dialog/DialogConfirmWithPassword"
import DialogLoading from "@/components/Dialog/DialogLoading"
import Button from "@/components/Button"
import UploadEMR from "@/views/Dashboard/Customer/EMR/UploadEMR"
import {
  queryGetEMRList,
  queryElectronicMedicalRecordInfoById,
} from "@/lib/polkadotProvider/query/electronicMedicalRecord"
import { removeElectronicMedicalRecordInfo } from "@/lib/polkadotProvider/command/electronicMedicalRecord"
import { downloadDecryptedFromIPFS } from "@/lib/ipfs"
import { hexToU8a } from "@polkadot/util"
import serviceHandler from "@/lib/metamask/mixins/serviceHandler"

export default {
  name: "emr",
  mixins: [serviceHandler],

  components: {
    DataTable,
    SearchBar,
    DialogConfirmWithPassword,
    DialogLoading,
    Button,
    UploadEMR,
  },

  data: () => ({
    headers: [
      { text: "Date", value: "date" },
      { text: "Title", value: "title" },
      { text: "Description", value: "description" },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        align: "center",
        width: "5%",
      },
    ],
    password: "",
    search: "",
    documentsHistory: [],
    confirmDeleteEMR: false,
    selectEMRRemoveId: "",
    action: "",
    showDialogLoading: false,
    showDialogUseTypeFile: false,
    uploadEMR: false,
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      mnemonicData: (state) => state.substrate.mnemonicData,
      lastEventData: (state) => state.substrate.lastEventData,
      loadingData: (state) => state.auth.loadingData,
    }),

    computeUploadText() {
      return !this.documentsHistory?.length
        ? "Upload an EMR document"
        : "Upload a document"
    }
  },

  watch: {
    lastEventData() {
      if (this.lastEventData != null) {
        const dataEvent = JSON.parse(this.lastEventData.data.toString())
        if (this.lastEventData.method == "ElectronicMedicalRecordInfoRemoved") {
          if (dataEvent[0].owner_id == this.wallet.address) {
            this.getDocumentsHistory()
          }
        }
      }
    },

    loadingData() {
      if (this.loadingData != null) {
        if (this.action == "download") {
          if (this.loadingData.loading) {
            this.showDialogLoading = true
            this.isLoading = true
          } else {
            this.isLoading = false
          }
        }
      }
    }
  },

  mounted() {
    this.getDocumentsHistory()
  },

  methods: {
    async getDocumentsHistory() {
      this.documentsHistory = []
      this.dispatch(this.getEMRHistory)
    },

    async getEMRHistory() {
      const dataEMR = await this.dispatch(queryGetEMRList, this.api, this.wallet.address)

      if (dataEMR != null) {
        const listEMR = dataEMR.info.reduce((filtered, current) => {
          if (filtered.every(v => v !== current)) filtered.push(current)

          return filtered
        }, [])

        if (listEMR.length > 0) {
          listEMR.reverse()
          for (let i = 0; i < listEMR.length; i++) {
            const emrDetail = await this.dispatch(queryElectronicMedicalRecordInfoById,
              this.api,
              listEMR[i]
            )

            if (emrDetail != null) {
              this.prepareEMRData(emrDetail)
            }
          }

          this.documentsHistory.sort(
            (a, b) => parseInt(b.timestamp) - parseInt(a.timestamp)
          )
        }
      }
    },

    prepareEMRData(dataEMR) {
      const title = dataEMR.title
      const description = dataEMR.description
      var d = new Date(parseInt(dataEMR.uploaded_at.replace(/,/g, "")))
      const timestamp = d.getTime().toString()
      const data = dataEMR
      const date = d.toLocaleString("en-US", {
        weekday: "short", // long, short, narrow
        day: "numeric", // numeric, 2-digit
        year: "numeric", // numeric, 2-digit
        month: "long", // numeric, 2-digit, long, short, narrow
      })

      const order = {
        title,
        description,
        data,
        date,
        timestamp,
        type: "emr",
      }

      this.documentsHistory.push(order)
    },

    goToDetail(item) {
      if (item.type == "emr") {
        this.$router.push({
          name: "document-detail",
          params: { number: item.data.id, type: item.type },
        })
      } else {
        this.$router.push({
          name: "result-test",
          params: { number: item.dna_sample_tracking_id },
        })
      }
    },

    async downloadFile(item) {
      this.action = "download"
      if (item.type == "emr") {
        const publicKey = hexToU8a(this.mnemonicData.publicKey)
        const privateKey = hexToU8a(this.mnemonicData.privateKey)
        const baseUrl = "https://ipfs.io/ipfs/"
        const path = item.data.record_link.replace(baseUrl, "")
        await this.dispatch(downloadDecryptedFromIPFS,
          path,
          privateKey,
          publicKey,
          item.data.id + ".pdf",
          "application/pdf"
        )
      }
    },

    confirmRemoveEMR(item) {
      this.confirmDeleteEMR = true
      this.selectEMRRemoveId = item.data.id
    },

    async removeEMRData(status) {
      if (status) {
        await this.dispatch(removeElectronicMedicalRecordInfo,
          this.api,
          this.wallet,
          this.selectEMRRemoveId
        )

        this.confirmDeleteEMR = false
        this.selectEMRRemoveId = ""
      }
    },

    onSearchInput(val) {
      this.search = val
    },

    useTypeUpload() {
      this.showDialogUseTypeFile = true
    },

    openUpload(typeFile) {
      // FIXME: Lines 346 - 348 Only for Demo
      if (typeFile == 'other') {
        return
      }
      this.showDialogUseTypeFile = false
      if (typeFile == "emr") {
        this.uploadEMR = true
      }
    },

    uploadSuccess(status) {
      if (status) {
        this.getDocumentsHistory()
      }
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/variables.scss";

.btn-sending {
  background-color: $color-primary !important;
}

.Sending {
  background-color: $color-primary !important;
}

.Received {
  background-color: $color-status-received !important;
}

.Succes {
  background-color: $color-status-success !important;
}

.Reject {
  background-color: $color-status-reject !important;
}

.hidetable {
  visibility: hidden;
  margin-bottom: 5rem;
}
</style>
