<template>
  <div>
    <v-container>
      <v-row v-if="isLoading">
        <v-progress-linear
          v-if="isLoading"
          class="mt-2"
          indeterminate
          color="primary"
        ></v-progress-linear>
      </v-row>
      <v-row v-if="!isLoading && dataLoaded">
        <v-col cols="12" lg="6" md="6" xl="5">
          <v-card class="dg-card" elevation="0" outlined>
            <v-card-text class="px-8">
              <div class="d-flex justify-space-between">
                <div class="text-h5">Lab Details</div>
                <StatusChip :status="order.status" />
              </div>
              <div v-if="lab">
                <div class="text-subtitle-1">
                  <b>{{ lab.info.name }}</b>
                </div>
                <div class="text-body-2">
                  {{ lab.info.address }}
                </div>
                <div class="text-body-2">{{ lab.info.city }}, {{ lab.info.country }}</div>
                <div v-if="lab.info.email" class="text-body-2">
                  Email: {{ lab.info.email }}
                </div>
              </div>
              <div class="my-8"></div>
              <div class="text-h5">Product Details</div>

              <template>
                <div class="d-flex align-center fill-height mb-2">
                  <div class="my-3 ml-0">
                    <v-icon
                      v-if="isValidIcon(service.info.image)"
                      color="#BA8DBB"
                      :size="48"
                    >
                      {{ service.info.image }}
                    </v-icon>
                    <v-avatar v-else>
                      <img src="../../../../assets/degenics-logo.png" />
                    </v-avatar>
                  </div>
                  <div class="ml-5">
                    <div class="text-h6">
                      <b>{{ service.info.name }}</b>
                    </div>
                    <div class="text-caption grey--text text--darken-1">
                      {{ service.info.description }}
                    </div>
                  </div>
                  <v-spacer></v-spacer>
                  <div class="align-self-end pb-2">
                    <span class="text-h6">
                      {{ service.info.price }}
                    </span>
                    <span class="primary--text text-caption"> DBIO </span>
                  </div>
                </div>
                <div>
                  <div><b>Specimen Number:</b></div>
                  <div class="grey--text text--darken-1">
                    {{ order.dna_sample_tracking_id | specimenNumber }}
                  </div>
                </div>
              </template>
            </v-card-text>
          </v-card>
          <!-- If order Success -->
          <div v-if="order.status == SUCCESS" class="mt-2">
            <Button color="green" @click="goToResult" dark>
              View Result
            </Button>
          </div>
        </v-col>

        <!-- If order is sending -->
        <v-col cols="12" lg="6" md="6" xl="5" v-if="order.status == SENDING">
          <DNASampleSendingInstructions
            :specimenNumber="order.number"
            :lab="lab"
          >
          </DNASampleSendingInstructions>
        </v-col>

        <!-- If order is received -->
        <v-col cols="12" lg="6" md="6" xl="5" v-if="order.status == RECEIVED">
          <Refund
            :order="order"
            :receivedLog="receivedLog"
            @refunded="onRefunded"
          />
        </v-col>

        <!-- If order is rejected -->
        <v-col cols="12" lg="6" md="6" xl="5" v-if="order.status == REJECTED">
          <v-card class="dg-card">
            <v-card-title class="px-8">
              <div class="text-h6">Rejection Reason</div>
            </v-card-title>
            <v-card-text class="px-8">
              {{ rejectionReason }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
//import keystore from "@/lib/keystore";
import DNASampleSendingInstructions from "@/components/DNASampleSendingInstructions";
import StatusChip from "@/components/StatusChip";
import Button from "@/components/Button";
import Refund from "./Refund";
import {
  SENDING,
  RECEIVED,
  SUCCESS,
  REJECTED,
  REFUNDED,
} from "@/constants/specimen-status";
//import { LOG_REJECTED, LOG_RECEIVED } from "@/constants/log-type";
import { getOrdersDetail } from "@/lib/polkadotProvider/query/orders";
import { queryLabsById } from "@/lib/polkadotProvider/query/labs";
import { queryServicesById } from "@/lib/polkadotProvider/query/services";

export default {
  name: "RequestTestSuccess",
  components: {
    DNASampleSendingInstructions,
    StatusChip,
    Button,
    Refund,
  },
  data: () => ({
    SENDING,
    RECEIVED,
    SUCCESS,
    REJECTED,
    REFUNDED,
    isLoading: false,
    lab: null,
    service: null,
    order: null,
    logs: [],
  }),
  computed: {
    ...mapState({
      walletBalance: (state) => state.substrate.walletBalance,
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
    }),
    // If we don't check if data exists, vue will complain 😦
    dataLoaded() {
      return this.lab && this.service && this.order;
    },
    // rejectionReason() {
    //   return this.logs.filter((l) => l.logType == LOG_REJECTED)[0].log;
    // },
    // receivedLog() {
    //   return this.logs.filter((l) => l.logType == LOG_RECEIVED)[0];
    // },
  },
  async mounted() {
    this.isLoading = true;
    await this.fetchOrderDetails();
    //await this.getLogs();
    this.isLoading = false;
  },
  methods: {
    async fetchOrderDetails() {
      const orderId = this.$route.params.number;
      this.order = await getOrdersDetail(this.api, orderId);
      this.lab = await queryLabsById(this.api, this.order.seller_id);
      this.service = await queryServicesById(this.api, this.order.service_id);

      console.log(this.order);
      console.log(this.lab);
      console.log(this.service);
    },
    isValidIcon(icon) {
      return icon && (icon.startsWith("mdi") || icon.startsWith("$"));
    },
    // async getLogs() {
    //   const ks = keystore.get();
    //   const logCount = await this.logContract.methods
    //     .countSpecimenLog(this.specimen.number)
    //     .call({ from: ks.address });

    //   const logPromises = [];
    //   for (let i = 1; i <= logCount; i++) {
    //     const promise = this.logContract.methods
    //       .specimenLogByIndex(this.specimen.number, i)
    //       .call();
    //     logPromises.push(promise);
    //   }
    //   const logs = await Promise.all(logPromises);

    //   this.logs = logs;
    // },
    // isValidIcon(icon) {
    //   return icon && (icon.startsWith("mdi") || icon.startsWith("$"));
    // },
    // goToHome() {
    //   this.$router.push("/");
    // },
    // goToResult() {
    //   this.$router.push({
    //     name: "result-test",
    //     params: { number: this.specimen.number },
    //   });
    // },
    // async getSpecimen() {
    //   const ks = keystore.get();
    //   const specimenNumber = this.$route.params.number;
    //   const specimen = await this.degenicsContract.methods
    //     .specimenByNumber(specimenNumber)
    //     .call({ from: ks.address });

    //   return specimen;
    // },
    // async getLabBySpecimen(specimen) {
    //   const ks = keystore.get();
    //   const lab = await this.degenicsContract.methods
    //     .labByAccount(specimen.labAccount)
    //     .call({ from: ks.address });

    //   return lab;
    // },
    // async getProduct(lab, specimen) {
    //   console.log(specimen);
    //   const ks = keystore.get();
    //   const services = await this.degenicsContract.methods
    //     .serviceCount(lab.labAccount)
    //     .call({ from: ks.address })
    //     .then(async (count) => {
    //       const servicePromises = [];
    //       for (let i = 1; i <= count; i++) {
    //         const promise = this.degenicsContract.methods
    //           .serviceByIndex(lab.labAccount, i)
    //           .call({ from: ks.address });
    //         servicePromises.push(promise);
    //       }
    //       const _services = await Promise.all(servicePromises);
    //       return _services;
    //     });
    //   const product = services.find((s) => s.code == specimen.serviceCode);

    //   // Parse product additionalData
    //   try {
    //     const additionalData = JSON.parse(product.additionalData);
    //     if (additionalData.icon) {
    //       product.icon = additionalData.icon;
    //     }
    //   } catch (err) {
    //     product.additionalData = {};
    //   }

    //   return product;
    // },
    // onRefunded() {
    //   this.specimen.status = REFUNDED;
    // },
  },
};
</script>

<style>
</style>
