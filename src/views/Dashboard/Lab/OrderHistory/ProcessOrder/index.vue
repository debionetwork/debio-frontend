<style scoped>
.card-header {
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
                <b>Progress</b>
              </div>
              <Stepper
                direction="vertical"
                :stepper-items="stepperItems"
                size="medium"
              />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="10" md="7">
          <v-card class="dg-card" elevation="0" outlined>
            <v-card-text class="px-8 mt-5">
              <div class="d-flex mb-8 justify-space-between">
                <b class="secondary--text card-header">Order Detail</b>
                <b class="secondary--text h6">
                  {{ this.createdAt | timestampToDate }}
                </b>
              </div>
              <div class="d-flex justify-space-between">
                <div class="d-flex align-center">
                  <div>
                    <v-icon v-if="_icon" color="#BA8DBB" :size="52">
                      {{ _icon }}
                    </v-icon>
                    <v-avatar v-else>
                      <img :src="getImageLink(serviceImage)" />
                    </v-avatar>
                  </div>
                  <div class="ml-5">
                    <div style="">
                      <b>{{ this.serviceName }}</b>
                    </div>
                    <div class="text-caption grey--text text--darken-1">
                      {{ this.serviceDescription.substring(0, 60) }}...
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

          <div v-if="showResultDialog">
            <v-alert class="mt-5" type="success">
              This order has been completed
            </v-alert>
          </div>
          <div v-if="showRejectDialog">
            <v-alert class="mt-5" type="danger">
              This specimen has been rejected
            </v-alert>
          </div>
          <ReceiveSpecimen
            v-if="showReceiveDialog"
            :specimen-number="specimenNumber"
            :is-biological="isBiological"
            @specimenReceived="onSpecimenReceived"
          />
          <QualityControlSpecimen
            v-if="showQualityControlDialog"
            :specimen-number="specimenNumber"
            :specimen-status="specimenStatus"
            @qualityControlPassed="onQcCompleted"
          />
          <WetWorkSpecimen
            v-if="showWetWorkDialog"
            :specimen-number="specimenNumber"
            :specimen-status="specimenStatus"
            @wetWorkCompleted="onWetWorkCompleted"
          />
          <ProcessSpecimen
            v-if="showGenomeReportDialog || showResultDialog"
            :order-id="orderId"
            :specimen-number="specimenNumber"
            :specimen-status="specimenStatus"
            :public-key="publicKey"
            :is-submitted="isSubmitted"
            @resultUploaded="onResultUploaded"
            @resultReady="onResultReady"
          />
          <DialogAlert
            :show="cancelledOrderDialog"
            btnText="Back"
            textAlert="Order has been cancelled"
            imgPath="warning.png"
            imgWidth="50"
            @toggle="cancelledOrderDialog = $event"
            @close="$router.push('/lab/orders')"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import ReceiveSpecimen from "./ReceiveSpecimen";
import QualityControlSpecimen from "./QualityControlSpecimen";
import ProcessSpecimen from "./ProcessSpecimen";
import WetWorkSpecimen from "./WetWorkSpecimen";
import { getOrdersDetail } from "@/lib/polkadotProvider/query/orders";
import DialogAlert from "@/components/Dialog/DialogAlert";
import Stepper from "@/components/Stepper";
import { queryDnaTestResults } from "@/lib/polkadotProvider/query/geneticTesting";
import { queryServicesById } from "@/lib/polkadotProvider/query/services";

export default {
  name: "ProcessOrderHistory",
  components: {
    ReceiveSpecimen,
    QualityControlSpecimen,
    WetWorkSpecimen,
    ProcessSpecimen,
    DialogAlert,
    Stepper,
  },
  data: () => ({
    publicKey: "",
    createdAt: "",
    customerEthAddress: "",
    sellerEthAddress: "",
    specimenNumber: "",
    specimenStatus: "",
    serviceName: "",
    serviceDescription: "",
    serviceImage: "",
    cancelledOrderDialog: false,
    showRejectDialog: false,
    showResultDialog: false,
    genomeFile: "",
    reportFile: "",
    isSubmitted: false,
    stepperItems: [
      { name: "Received", selected: false },
      { name: "Quality Control", selected: false },
      { name: "Analyzed", selected: false },
      { name: "Upload Result", selected: false },
      { name: "Results Ready", selected: false },
    ],
    dnaCollectionProcess: "",
    isBiological: false,
    testResult: null,
  }),
  async mounted() {
    try {
      // If no order id redirect to Payment History list
      if (!this.orderId) {
        this.$router.push({ name: "lab-dashboard-order-history" });
      }
      const order = await getOrdersDetail(this.api, this.orderId);
      const serviceInfo = await queryServicesById(this.api, order.serviceId);
      const testResult = await queryDnaTestResults(this.api, this.specimenNumber);

      this.dnaCollectionProcess = serviceInfo.info.dnaCollectionProcess;
      if (this.dnaCollectionProcess.includes("Covid")) {
        this.isBiological = true;
      }

      if (order.status == "Cancelled") {
        this.cancelledOrderDialog = true;
      }
      this.serviceName = order.service_name;
      this.serviceDescription = order.service_description;
      this.serviceImage = order.service_image;
      this.publicKey = order.customerBoxPublicKey;
      this.createdAt = order.createdAt;
      this.customerEthAddress = order.customer_eth_address
        ? order.customer_eth_address
        : "Address not set";
      this.sellerEthAddress = order.seller_eth_address;
      this.specimenNumber = order.dnaSampleTrackingId;
      this.specimenStatus = order.dna_sample_status;
      if (testResult) this.testResult = testResult;
      this.setCheckboxByDnaStatus();
      
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    async setCheckboxByDnaStatus() {
      if (this.specimenStatus == "Arrived") {
        this.onSpecimenReceived();
        if (this.isBiological == true) {
          this.onQcCompleted();
        }
      }

      if (this.specimenStatus == "Rejected") {
        this.showRejectDialog = true;
        this.onQcCompleted();
      }

      if (this.specimenStatus == "QualityControlled") {
        this.onQcCompleted();
      }
      
      if (this.testResult) {
        this.setUploadFields(this.testResult);
      }

      if (this.specimenStatus == "WetWork") {
        this.onWetWorkCompleted();
      }


      if (this.specimenStatus == "ResultReady") {
        this.isSubmitted = true;
        this.onResultReady();
      }
    },

    setUploadFields(testResult) {
      const { resultLink, reportLink } = testResult;
      if (resultLink && resultLink != "" && reportLink && reportLink != "") {
        this.onResultUploaded();
      }
    },

    onSpecimenReceived() {
      this.setStepperSelected(["Received"], true);
    },

    onQcCompleted() {
      this.setStepperSelected(["Received", "Quality Control"], true);
    },

    onWetWorkCompleted() {
      this.setStepperSelected(
        ["Received", "Quality Control", "Analyzed"],
        true
      );
    },

    onResultUploaded() {
      this.setStepperSelected(
        ["Received", "Quality Control", "Analyzed", "Upload Result"],
        true
      );
    },

    onResultReady() {
      this.showResultDialog = true;
      this.setStepperSelected(
        [
          "Received",
          "Quality Control",
          "Analyzed",
          "Upload Result",
          "Results Ready",
        ],
        true
      );
    },

    getImageLink(val) {
      if (val && val != "") {
        return val;
      }
      return "https://ipfs.io/ipfs/QmaGr6N6vdcS13xBUT4hK8mr7uxCJc7k65Hp9tyTkvxfEr";
    },

    setStepperSelected(names, selected) {
      this.stepperItems = this.stepperItems.map((item) => {
        if (names.includes(item.name)) {
          return { ...item, selected };
        }
        return { ...item };
      });
    },
  },
  computed: {
    ...mapState({
      genome: (state) => state.testResult.genome,
      report: (state) => state.testResult.report,
    }),

    ...mapGetters({
      api: "substrate/getAPI",
      pair: "substrate/wallet",
    }),

    orderId() {
      return this.$route.params.orderId ? this.$route.params.orderId : "";
    },

    showReceiveDialog() {
      return this.stepperItems.some(
        (item) => item.name == "Received" && item.selected == false
      );
    },

    showQualityControlDialog() {
      return (
        (this.stepperItems.some(
          (item) => item.name == "Received" && item.selected == true
        ) &&
          this.stepperItems.some(
            (item) => item.name == "Quality Control" && item.selected == false
          )) ||
        this.specimenStatus == "Rejected"
      );
    },

    showWetWorkDialog() {
      return (
        this.stepperItems.some(
          (item) => item.name == "Quality Control" && item.selected == true
        ) &&
        this.stepperItems.some(
          (item) => item.name == "Analyzed" && item.selected == false
        ) &&
        this.specimenStatus != "Rejected"
      );
    },

    showGenomeReportDialog() {
      return (
        (this.stepperItems.some(
          (item) => item.name == "Analyzed" && item.selected == true
        ) &&
          this.stepperItems.some(
            (item) => item.name == "Upload Result" && item.selected == false
          )) ||
        (this.stepperItems.some(
          (item) => item.name == "Upload Result" && item.selected == true
        ) &&
          this.stepperItems.some(
            (item) => item.name == "Results Ready" && item.selected == false
          ) &&
          this.specimenStatus != "Rejected")
      );
    },

    _icon() {
      return this.serviceImage &&
        (this.serviceImage.startsWith("mdi") ||
          this.serviceImage.startsWith("$"))
        ? this.serviceImage
        : false;
    },
  },
};
</script>
