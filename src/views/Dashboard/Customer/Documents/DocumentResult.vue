<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" md="8">
          <div class="secondary--text mb-2"><b>Document Record</b></div>
          <v-card class="dg-card" width="100%">
            <v-progress-linear
              v-if="resultLoading"
              indeterminate
              color="primary"
            ></v-progress-linear>
            <div v-else>
              <v-card-title>{{ dataDetail.title }}</v-card-title>
              <v-card-text>
                {{ dataDetail.description }}
              </v-card-text>
              <div class="pt-5, pb-5, pl-5 pr-5">
                <iframe
                  :src="result"
                  style="width: 100%; height: 600px; border: none"
                >
                  Oops! an error has occurred.
                </iframe>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <div class="secondary--text mb-2"><b>Action</b></div>
          <div v-for="(file, index) in files" :key="file.name" class="mb-2">
            <MenuCard
              icon="mdi-file-document-multiple-outline"
              :title="file.fileType"
              :sub-title="file.fileName"
              :loading="filesLoading[index]"
              :disabled="filesLoading[index]"
              @click="showDialog('download', index)"
            />
          </div>
          <div class="mb-2">
            <v-tooltip top max-width="350">
              <template v-slot:activator="{ on, attrs }">
                <v-card
                  v-on="on"
                  v-bind="attrs" 
                  class="dg-card dg-menu-card"
                  :class="{ 'card-hover': true }"
                  :elevation="0"
                  @click="true"
                  outlined
                  :style="'border-radius: 10px;'"
                  :ripple="false"
                >
                  <div
                    class="
                      d-flex
                      flex-column
                      justify-space-around
                      fill-height
                      pr-4
                      py-2
                    "
                  >
                    <div class="d-flex align-center">
                      <div class="my-3 ml-5">
                        <v-avatar>
                          <img src="@/assets/reward.png" />
                        </v-avatar>
                      </div>
                      <div class="ml-5" style="width: 100%">
                        <div class="text-h6">
                          <b>Stake Data</b>
                        </div>
                        <div
                          class="text-caption grey--text text--darken-1"
                          style="
                            max-height: 60px;
                            overflow: hidden;
                            display: -webkit-box;
                            -webkit-line-clamp: 3;
                            -webkit-box-orient: vertical;
                          "
                        >
                          Stake my data anonymously
                        </div>
                      </div>
                    </div>
                  </div>
                </v-card>
              </template>
              Under Development
            </v-tooltip>
          </div>
        </v-col>
      </v-row>
      <DialogLoading
        :show="showDialogLoading"
        @toggle="showDialogLoading = $event"
      ></DialogLoading>
    </v-container>
  </div>
</template>

<script>
import MenuCard from "@/components/MenuCard";
import ipfsWorker from "@/web-workers/ipfs-worker";
import { mapState } from "vuex";
import { hexToU8a } from "@polkadot/util";
import { downloadDecryptedFromIPFS } from "@/lib/ipfs";
import { queryElectronicMedicalRecordInfoById } from "@/lib/polkadotProvider/query/electronicMedicalRecord";
import DialogLoading from "@/components/Dialog/DialogLoading";

export default {
  name: "document-detail",
  components: {
    MenuCard,
    DialogLoading,
  },
  data: () => ({
    privateKey: "",
    publicKey: "",
    docId: "",
    typeDoc: "",
    ownerAddress: "",
    files: [],
    dataDetail: {},
    result: "",
    isLoading: false,
    actionType: "result",
    fileDownloadIndex: 0,
    filesLoading: [],
    resultLoading: false,
    baseUrl: "https://ipfs.io/ipfs/",
    showDialogLoading: false,
  }),
  async mounted() {
    this.docId = this.$route.params.number;
    this.typeDoc = this.$route.params.type;
    this.privateKey = hexToU8a(this.mnemonicData.privateKey);
    this.publicKey = hexToU8a(this.mnemonicData.publicKey);
    this.ownerAddress = this.wallet.address;

    await this.initData();
  },
  methods: {
    async initData() {
      this.isLoading = true;
      if (this.typeDoc == "emr") {
        await this.getDetailEMR();
      }
    },
    async getDetailEMR() {
      try {
        this.dataDetail = await queryElectronicMedicalRecordInfoById(
          this.api,
          this.docId
        );
        console.log(this.dataDetail);
        const fileType = "application/pdf";
        const fileName = "EMR Record";
        await this.getFileUploaded(fileType, fileName);
        await this.decryptWallet();
      } catch (error) {
        console.log(error);
      }
    },
    async getFileUploaded(fileType, fileName) {
      try {
        if (this.dataDetail.recordLink != "") {
          this.files.push({
            fileType: fileType,
            fileName: fileName,
            fileLink: this.dataDetail.recordLink,
          });
        }

        this.filesLoading = new Array(this.files.length).fill(false);
      } catch (error) {
        console.log(error);
      }
    },
    async decryptWallet() {
      try {
        if (this.actionType == "result") {
          await this.parseResult();
        }

        if (this.actionType == "download") {
          await this.downloadFile();
        }
        this.isLoading = false;
      } catch (e) {
        console.log(e);
        this.isLoading = false;
      }
    },
    async parseResult() {
      this.resultLoading = true;
      const path = this.files[0].fileLink.replace(this.baseUrl, "");

      const secretKey = this.privateKey;
      const publicKey = this.publicKey;

      const pair = {
        secretKey,
        publicKey,
      };

      const typeFile = "application/pdf";
      const channel = new MessageChannel();
      channel.port1.onmessage = ipfsWorker.workerDownload;
      ipfsWorker.workerDownload.postMessage({ path, pair, typeFile }, [
        channel.port2,
      ]);
      ipfsWorker.workerDownload.onmessage = (event) => {
        const blob = new Blob([event.data], { type: typeFile });
        this.result = window.URL.createObjectURL(blob);
        console.log(this.result);
        this.resultLoading = false;
        //window.URL.createObjectURL(blob)
      };
    },
    async downloadFile() {
      if (this.typeDoc == "emr") {
        this.showDialogLoading = true;
        const path = this.dataDetail.recordLink.replace(this.baseUrl, "");
        await downloadDecryptedFromIPFS(
          path,
          this.privateKey,
          this.publicKey,
          this.dataDetail.id + ".pdf",
          "application/pdf"
        );
      }
    },
    showDialog(actionType, index) {
      this.actionType = actionType;
      this.fileDownloadIndex = index;
      this.decryptWallet();
    },
  },

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      mnemonicData: (state) => state.substrate.mnemonicData,
    }),
    reportResult() {
      if (this.resultLoading) {
        return "Decrypting report..";
      }
      return this.result ? this.result : "No report available for this result";
    },
  },
};
</script>

<style>
</style>
