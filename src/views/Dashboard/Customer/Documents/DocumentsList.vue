<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <!-- :sort-by="['timestamp']" -->
          <DataTable
            :headers="headers"
            :items="documentsHistory"
            :search="search"
            :sort-desc="[true]"
            :loading="isLoading"
            additional-class="laporan-table"
          >
            <template v-slot:search-bar>
              <SearchBar
                label="Title, Description"
                @input="onSearchInput"
              ></SearchBar>
            </template>
            <!-- <template v-slot:[`item.dna_sample_tracking_id`]="{ item }">
              {{ item.dna_sample_tracking_id | specimenNumber }}
            </template>
             -->

            <template v-slot:[`item.actions`]="{ item }">
              <v-container v-if="item.data.record_link != ''">
                <div class="d-flex align-center">
                  <v-btn icon @click="goToDetail(item)">
                    <v-icon color="green">mdi-book-open</v-icon>
                  </v-btn>
                  <v-btn icon @click="downloadFile(item)">
                    <v-icon color="grey">mdi-file-download</v-icon>
                  </v-btn>
                  <v-btn icon @click="confirmRemoveEMR(item)">
                    <v-icon color="red">mdi-file-remove</v-icon>
                  </v-btn>
                </div>
              </v-container>
            </template>
            <!-- Rows -->
          </DataTable>
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
    </v-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
import DataTable from "@/components/DataTable";
import SearchBar from "@/components/DataTable/SearchBar";
import DialogConfirmWithPassword from "@/components/Dialog/DialogConfirmWithPassword";
import {
  queryGetEMRList,
  queryElectronicMedicalRecordInfoById,
} from "@/lib/polkadotProvider/query/electronicMedicalRecord";
import { removeElectronicMedicalRecordInfo } from "@/lib/polkadotProvider/command/electronicMedicalRecord";
import { downloadDecryptedFromIPFS } from "@/lib/ipfs";
import { hexToU8a } from "@polkadot/util";

export default {
  name: "documents",
  components: {
    DataTable,
    SearchBar,
    DialogConfirmWithPassword,
  },
  data: () => ({
    headers: [
      //{ text: "Date", value: "date" },
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
    isLoading: false,
    documentsHistory: [],
    confirmDeleteEMR: false,
    selectEMRRemoveId: "",
  }),
  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      mnemonicData: (state) => state.substrate.mnemonicData,
      lastEventData: (state) => state.substrate.lastEventData,
    }),
  },
  watch: {
    lastEventData() {
      if (this.lastEventData != null) {
        const dataEvent = JSON.parse(this.lastEventData.data.toString());
        if (this.lastEventData.method == "ElectronicMedicalRecordInfoRemoved") {
          if (dataEvent[0].owner_id == this.wallet.address) {
            this.getDocumentsHistory();
          }
        }
      }
    },
  },
  mounted() {
    this.getDocumentsHistory();
  },
  methods: {
    async getDocumentsHistory() {
      this.isLoading = true;
      try {
        this.documentsHistory = [];
        await this.getEMRHistory();
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
      }
    },
    async getEMRHistory() {
      try {
        console.log(this.wallet.address);
        const dataEMR = await queryGetEMRList(this.api, this.wallet.address);

        if (dataEMR != null) {
          const listEMR = dataEMR.info;
          if (listEMR.length > 0) {
            listEMR.reverse();
            for (let i = 0; i < listEMR.length; i++) {
              const emrDetail = await queryElectronicMedicalRecordInfoById(
                this.api,
                listEMR[i]
              );
              this.prepareEMRData(emrDetail);
            }
            // this.documentsHistory.sort(
            //   (a, b) => parseInt(b.timestamp) - parseInt(a.timestamp)
            // );
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    prepareEMRData(dataEMR) {
      const title = dataEMR.title;
      const description = dataEMR.description;
      const data = dataEMR;
      const order = {
        title,
        description,
        data,
        type: "emr",
      };

      this.documentsHistory.push(order);
      console.log(this.documentsHistory);
    },
    goToDetail(item) {
      if (item.type == "emr") {
        this.$router.push({
          name: "document-detail",
          params: { number: item.data.id, type: item.type },
        });
      } else {
        this.$router.push({
          name: "result-test",
          params: { number: item.dna_sample_tracking_id },
        });
      }
    },
    async downloadFile(item) {
      if (item.type == "emr") {
        const publicKey = hexToU8a(this.mnemonicData.publicKey);
        const privateKey = hexToU8a(this.mnemonicData.privateKey);
        const baseUrl = "https://ipfs.io/ipfs/";
        const path = item.data.record_link.replace(baseUrl, "");
        await downloadDecryptedFromIPFS(
          path,
          privateKey,
          publicKey,
          item.data.id + ".pdf",
          "application/pdf"
        );
      }
    },
    confirmRemoveEMR(item) {
      this.confirmDeleteEMR = true;
      this.selectEMRRemoveId = item.data.id;
    },
    async removeEMRData(status) {
      if (status) {
        try {
          this.isLoading = true;
          await removeElectronicMedicalRecordInfo(
            this.api,
            this.wallet,
            this.selectEMRRemoveId
          );
          this.confirmDeleteEMR = false;
          this.selectEMRRemoveId = "";
        } catch (err) {
          console.log(err);
          this.isLoading = false;
        }
      }
    },
    onSearchInput(val) {
      this.search = val;
    },
  },
};
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
</style>
