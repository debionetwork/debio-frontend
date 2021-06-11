<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" md="8">
          <div class="secondary--text mb-2"><b>Test Result Report</b></div>
          <v-card class="dg-card" width="100%">
            <v-progress-linear
              v-if="resultLoading"
              indeterminate
              color="primary"
            ></v-progress-linear>
            <v-card-title>{{ serviceName }} Report</v-card-title>
            <v-card-text>
              {{ reportResult }}
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <div class="secondary--text mb-2"><b>Test Result Files</b></div>
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
            <v-card
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
    </v-container>
  </div>
</template>

<script>
import MenuCard from "@/components/MenuCard";
import ipfsWorker from "@/web-workers/ipfs-worker";
import localStorage from "@/lib/local-storage";
import Wallet from "@/lib/dgnx-wallet";
import { mapState } from "vuex";
import { queryDnaTestResults } from "@/lib/polkadotProvider/query/geneticTesting";
import { queryLabsById } from "@/lib/polkadotProvider/query/labs";
import { queryServicesById } from "@/lib/polkadotProvider/query/services";
import { getOrdersDetail } from "@/lib/polkadotProvider/query/orders";

export default {
  name: "test-result",
  components: {
    MenuCard,
  },
  data: () => ({
    privateKey: "",
    specimentNumberInput: "",
    ownerAddress: "",
    files: [],
    dialog: false,
    password: "",
    speciment: {},
    services: [],
    lab: null,
    order: null,
    serviceName: "",
    result: "",
    isLoading: false,
    actionType: "result",
    fileDownloadIndex: 0,
    filesLoading: [],
    resultLoading: false,
  }),
  async mounted() {
    this.specimentNumberInput = this.$route.params.number;
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
      } catch (error) {
        console.log(error);
      }
    },
    async getLabServices() {
      try {
        this.lab = await queryLabsById(this.api, this.speciment.lab_id);
        this.order = await getOrdersDetail(this.api, this.speciment.order_id);
        this.ownerAddress = this.order.customer_eth_address;
        this.services = await queryServicesById(
          this.api,
          this.order.service_id
        );
        this.serviceName = this.services.info.name;
      } catch (err) {
        this.services = [];
      }
    },
    async getFileUploaded() {
      try {
        const address = this.ownerAddress;
        const arrFile = await this.contractDegenics.methods
          .getFile(this.specimentNumberInput)
          .call({ from: address });
        this.files = JSON.parse(arrFile);
        this.filesLoading = new Array(this.files.length).fill(false);
      } catch (error) {
        console.error(error);
      }
    },
    async decryptWallet() {
      this.dialog = true;
      if (this.password == "") {
        return;
      }
      const keystore = localStorage.getKeystore();
      const wallet = await Wallet.decrypt(keystore, this.password);
      this.ownerAddress = wallet.address;
      const privateKey = wallet.privateKey;
      if (this.actionType == "result") {
        await this.parseResult(privateKey);
      }

      if (this.actionType == "download") {
        await this.downloadDecryptedFromIPFS(privateKey);
      }

      this.isLoading = false;
      this.dialog = false;
      this.password = "";
    },
    download(data, fileName) {
      const blob = new Blob([data], { type: "text/plain" });
      const e = document.createEvent("MouseEvents");
      const a = document.createElement("a");
      a.download = fileName;
      a.href = window.URL.createObjectURL(blob);
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
    async downloadDecryptedFromIPFS(privateKey) {
      const channel = new MessageChannel();
      channel.port1.onmessage = ipfsWorker.workerDownload;
      let fileList = this.files[this.fileDownloadIndex].ipfsPath;
      this.filesLoading[this.fileDownloadIndex] = true;
      ipfsWorker.workerDownload.postMessage({ file: fileList, privateKey }, [
        channel.port2,
      ]);
      ipfsWorker.workerDownload.onmessage = (event) => {
        this.download(event.data, this.files[this.fileDownloadIndex].fileName);
        this.privateKey = "";
        this.$set(this.filesLoading, this.fileDownloadIndex, false);
      };
    },
    async parseResult(privateKey) {
      this.resultLoading = true;
      let fileResult = this.files.find((o) => o.fileType == "report");
      console.log(this.files);
      if (!fileResult) {
        this.resultLoading = false;
        return;
      }
      let fileList = fileResult.ipfsPath;
      const channel = new MessageChannel();
      channel.port1.onmessage = ipfsWorker.workerDownload;
      ipfsWorker.workerDownload.postMessage({ file: fileList, privateKey }, [
        channel.port2,
      ]);
      ipfsWorker.workerDownload.onmessage = (event) => {
        // const blob = new Blob([ event.data ], {type: 'text/plain'})
        this.result = event.data;
        //window.URL.createObjectURL(blob)
      };
      this.resultLoading = false;
    },
    showDialog(actionType, index) {
      this.dialog = true;
      this.actionType = actionType;
      this.fileDownloadIndex = index;
    },
  },

  computed: {
    ...mapState({
      contractDegenics: (state) => state.ethereum.contracts.contractDegenics,
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
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
