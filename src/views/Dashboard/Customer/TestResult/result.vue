<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" md="8">
          <div class="secondary--text mb-2"><b>DNA Test Report</b></div>
          <v-card class="dg-card" width="100%">
            <v-progress-linear
              v-if="resultLoading"
              indeterminate
              color="primary"
            ></v-progress-linear>
            <!-- <v-card-title>{{ serviceName }} Report</v-card-title> -->
            <v-card-text>
              <embed
                :src="reportResult"
                type="application/pdf"
                v-if="isDataPdf"
                scrolling="auto"
                height="1000px"
                width="100%"
              />
              <span v-else>
                {{ reportResult }}
              </span>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <div class="secondary--text mb-2"><b>Test Result Files</b></div>
          <div v-for="(file, index) in files" :key="file.name" class="mb-2">
            <MenuCard
              icon="mdi-file-document-multiple-outline"
              :title="file.fileTitle"
              :sub-title="file.fileSubTitle"
              :loading="filesLoading[index]"
              :disabled="filesLoading[index]"
              @click="showDialog('download', index)"
            />
          </div>
          
          <div class="mb-2">
            <v-card
              v-if="!dataStaked" 
              class="dg-card dg-menu-card grey lighten-1"
              :class="{ 'card-hover': true }"
              :elevation="0"
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
                      <!-- Stake my data anonymously  -->
                      Upcoming Feature
                    </div>
                  </div>
                </div>
              </div>
            </v-card>

            <v-card
              v-else
              class="dg-card dg-menu-card grey lighten-1"
              :elevation="0"
              outlined
              :style="'border-radius: 10px;'"
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
                    <div class="text">
                      Your data has been staked in the Market Place
                    </div>
                  </div>
                </div>
              </div>
            </v-card>

          </div>
        </v-col>
      </v-row>
      <v-dialog v-model="dialog" max-width="600px" persistent>
        <template>
          <v-card>
            <v-card-title class="headline grey lighten-2">
              Please Input your password to verify your account
            </v-card-title>
            <v-progress-linear
              v-if="isLoading"
              indeterminate
              color="primary"
            ></v-progress-linear>
            <v-card-text>
              <v-text-field
                class="mt-4"
                outlined
                auto-grow
                type="password"
                v-model="password"
                label="Input your password"
              />
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                v-if="actionType == 'result'"
                color="primary"
                text
                @click="decryptWallet()"
              >
                decrypt wallet
              </v-btn>
              <v-btn
                v-if="actionType == 'download'"
                color="primary"
                text
                @click="decryptWallet()"
              >
                Download
              </v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
      <DialogStakingDataConfirmation 
        :show="stakeDialog" 
        @toggle="stakeDialog = $event"
        @close="closeDialog()"
      />
    </v-container>
  </div>
</template>

<script>
import MenuCard from "@/components/MenuCard";
import ipfsWorker from "@/web-workers/ipfs-worker";
import { mapState } from "vuex";
import { queryDnaTestResults } from "@/lib/polkadotProvider/query/geneticTesting";
import { queryLabsById } from "@/lib/polkadotProvider/query/labs";
import { queryServicesById } from "@/lib/polkadotProvider/query/services";
import { getOrdersData } from "@/lib/polkadotProvider/query/orders";
import { hexToU8a } from "@polkadot/util";
import DialogStakingDataConfirmation from "@/components/Dialog/DialogStakingDataConfirmation"

export default {
  name: "test-result",
  components: {
    MenuCard,
    DialogStakingDataConfirmation
  },
  data: () => ({
    privateKey: "",
    publicKey: "",
    specimentNumberInput: "",
    ownerAddress: "",
    files: [],
    dialog: false,
    password: "",
    speciment: {},
    services: [],
    lab: null,
    order: null,
    isDataPdf: false,
    serviceName: "",
    result: "",
    isLoading: false,
    actionType: "result",
    fileDownloadIndex: 0,
    filesLoading: [],
    resultLoading: false,
    baseUrl: "https://ipfs.io/ipfs/",
    stakeDialog: false,
    dataStaked: false
  }),
  async mounted() {
    this.resultLoading = true;
    this.specimentNumberInput = this.$route.params.number;
    this.privateKey = hexToU8a(this.mnemonicData.privateKey);
    this.ownerAddress = this.wallet.address;
    await this.getSpciments();
    await this.getLabServices();
    await this.getFileUploaded();
    await this.decryptWallet();
  },
  methods: {
    async getSpciments() {
      try {
        this.speciment = await queryDnaTestResults(
          this.api,
          this.specimentNumberInput
        );
        console.log(this.speciment);
      } catch (error) {
        this.resultLoading = false;
        console.log(error);
      }
    },
    async getLabServices() {
      try {
        this.lab = await queryLabsById(this.api, this.speciment.lab_id);
        this.order = await getOrdersData(this.api, this.speciment.order_id);
        this.ownerAddress = this.order.customer_eth_address;
        this.services = await queryServicesById(
          this.api,
          this.order.service_id
        );
        console.log("Lab -> ", this.lab);
        this.serviceName = this.services.info.name;
      } catch (err) {
        this.resultLoading = false;
        this.services = [];
      }
    },
    async getFileUploaded() {
      try {
        if (this.speciment.report_link != "") {
          this.files.push({
            fileType: "report",
            fileName: this.serviceName + " Report",
            fileLink: this.speciment.report_link,
            fileTitle: "Download Report",
            fileSubTitle: "Download Your Test Report"
          });
        }

        if (this.speciment.result_link != "") {
          this.files.push({
            fileType: "result",
            fileName: this.serviceName + " Result",
            fileLink: this.speciment.result_link,
            fileTitle: "Download Raw Data",
            fileSubTitle: "Download Your Genomic Data"
          });
        }
        this.filesLoading = new Array(this.files.length).fill(false);
      } catch (error) {
        this.resultLoading = false;
        console.log(error);
      }
    },
    async decryptWallet() {
      // this.dialog = true;
      // if (this.password == "") {
      //   return;
      // }
      try {
        //this.wallet.decodePkcs8(this.password);
        this.publicKey = this.lab.info.box_public_key;
        if (this.actionType == "result") {
          await this.parseResult();
        }

        if (this.actionType == "download") {
          await this.downloadDecryptedFromIPFS();
        }
        this.dialog = false;
        this.password = "";
        this.isLoading = false;
      } catch (e) {
        console.log(e);
        this.isLoading = false;
        this.resultLoading = false;
        this.password = "";
      }
    },
    async parseResult() {
      try {
        const path = this.files[0].fileLink.replace(this.baseUrl, "");
        const secretKey = this.privateKey;
        const publicKey = this.lab.info.box_public_key;

        const pair = {
          secretKey,
          publicKey,
        };

        const typeFile = "text/plain";
        const channel = new MessageChannel();
        channel.port1.onmessage = ipfsWorker.workerDownload;
        ipfsWorker.workerDownload.postMessage({ path, pair, typeFile }, [
          channel.port2,
        ]);
        ipfsWorker.workerDownload.onmessage = (event) => {
          const regexMatchPdf = /^(data:application\/\pdf)/g
          const isDataPdf = regexMatchPdf.test(event.data)
          this.isDataPdf = isDataPdf

          this.result = event.data;
          this.resultLoading = false;
        };
        console.log(this.result);
      } catch (e) {
        this.resultLoading = false;
      }
    },
    async downloadDecryptedFromIPFS() {
      try {
        const channel = new MessageChannel();
        channel.port1.onmessage = ipfsWorker.workerDownload;
        const path = this.files[this.fileDownloadIndex].fileLink.replace(
          this.baseUrl,
          ""
        );
        const secretKey = this.privateKey;
        const publicKey = this.publicKey;
        const pair = {
          secretKey,
          publicKey,
        };
        const typeFile = "text/plain";

        this.filesLoading[this.fileDownloadIndex] = true;
        ipfsWorker.workerDownload.postMessage({ path, pair, typeFile }, [
          channel.port2,
        ]);
        ipfsWorker.workerDownload.onmessage = (event) => {
          this.download(
            event.data,
            this.files[this.fileDownloadIndex].fileName
          );
          this.$set(this.filesLoading, this.fileDownloadIndex, false);
        };
      } catch (e) {
        console.log(e);
      }
    },
    download(data, fileName) {
      const blob = new Blob([data], { type: "text/plain" });
      const e = document.createEvent("MouseEvents");
      const a = document.createElement("a");
      a.download = fileName;
      a.href = this.isDataPdf
        ? data
        : window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
      e.initEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      a.dispatchEvent(e);
    },
    showDialog(actionType, index) {
      // this.dialog = true;
      this.actionType = actionType;
      this.fileDownloadIndex = index;
      this.decryptWallet();
    },
    showDialogStake(){
      this.stakeDialog = true
    },
    closeDialog(){
      this.dataStaked = true
      this.stakeDialog = false
    }
  },

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      mnemonicData: (state) => state.substrate.mnemonicData,
    }),
    reportResult() {
      if (this.dialog) {
        return "";
      }
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
