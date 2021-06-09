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
                <div class="text-body-2">
                  {{ lab.info.city }}, {{ lab.info.country }}
                </div>
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
                      {{ priceOrder }}
                    </span>
                    <span class="primary--text text-caption">
                      {{ coinName }}
                    </span>
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

        <!-- If Order Unpaid -->
        <v-col
          cols="12"
          lg="6"
          md="6"
          xl="5"
          v-if="order.status == ORDER_UNPAID"
        >
          <v-card class="dg-card pb-3" elevation="0" outlined>
            <v-card-title class="px-8">
              <div class="text-h6">Order</div>
            </v-card-title>
            <v-card-text class="px-8">
              <div class="d-flex justify-space-between">
                <div class="text-h6">Total Price</div>
                <div>
                  <span class="text-h6">
                    {{ priceOrder }}
                  </span>
                  <span class="primary--text text-caption">
                    {{ coinName }}
                  </span>
                </div>
              </div>
            </v-card-text>
            <v-card-actions class="px-8">
              <v-btn
                depressed
                color="primary"
                large
                width="100%"
                @click="openMetamask"
              >
                PAY
              </v-btn>
            </v-card-actions>
            <v-card-actions class="px-8">
              <v-btn
                depressed
                color="orange"
                large
                width="100%"
                @click="showDialogCancelOrder"
              >
                CANCEL
              </v-btn>
            </v-card-actions>
          </v-card>
          <DialogConfirmWithPassword
            :show="confirmDeleteOrder"
            :title="'Cancel Order Request'"
            :contentText="'Are you sure you want to cancel this order request?'"
            :buttonTitle="'Cancel Order'"
            @toggle="confirmDeleteOrder = $event"
            @status-confirm="({ status }) => cancelOrderRequest(status)"
          ></DialogConfirmWithPassword>
        </v-col>
        <DialogAlert
          :show="dialogAlert"
          :btnText="alertTextBtn"
          :textAlert="alertTextAlert"
          :imgPath="alertImgPath"
          :imgWidth="imgWidth"
          @toggle="dialogAlert = $event"
          @close="actionAlert()"
        ></DialogAlert>

        <!-- If order is sending -->
        <v-col cols="12" lg="6" md="6" xl="5" v-if="order.status == ORDER_PAID">
          <DNASampleSendingInstructions
            :specimenNumber="order.dna_sample_tracking_id"
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
import DNASampleSendingInstructions from "@/components/DNASampleSendingInstructions";
import DialogConfirmWithPassword from "@/components/Dialog/DialogConfirmWithPassword";
import DialogAlert from "@/components/Dialog/DialogAlert";
import StatusChip from "@/components/StatusChip";
import Button from "@/components/Button";
import Refund from "./Refund";
import {
  ORDER_UNPAID,
  ORDER_PAID,
  ORDER_CANCEL,
  SENDING,
  RECEIVED,
  SUCCESS,
  REJECTED,
  ORDER_REFUNDED,
} from "@/constants/specimen-status";
import { getOrdersDetail } from "@/lib/polkadotProvider/query/orders";
import { queryLabsById } from "@/lib/polkadotProvider/query/labs";
import { queryServicesById } from "@/lib/polkadotProvider/query/services";
import { transfer, getPrice } from "@/lib/metamask/wallet.js";
import { ethAddressByAccountId } from "@/lib/polkadotProvider/query/userProfile";
import { cancelOrder } from "@/lib/polkadotProvider/command/orders";
import { startApp } from "@/lib/metamask";

export default {
  name: "RequestTestSuccess",
  components: {
    DNASampleSendingInstructions,
    DialogConfirmWithPassword,
    DialogAlert,
    StatusChip,
    Button,
    Refund,
  },
  data: () => ({
    ORDER_UNPAID,
    ORDER_PAID,
    ORDER_CANCEL,
    SENDING,
    RECEIVED,
    SUCCESS,
    REJECTED,
    ORDER_REFUNDED,
    isLoading: false,
    lab: null,
    service: null,
    order: null,
    confirmDeleteOrder: false,
    dialogAlert: false,
    priceOrder: "",
    alertType: "",
    alertTextBtn: "Close",
    alertImgPath: "warning.png",
    alertTextAlert: "",
    imgWidth: "50",
    logs: [],
    coinName: "",
  }),
  computed: {
    ...mapState({
      walletBalance: (state) => state.substrate.walletBalance,
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      lastEventData: (state) => state.substrate.lastEventData,
      metamaskWalletAddress: (state) => state.metamask.metamaskWalletAddress,
      metamaskWalletBalance: (state) => state.metamask.metamaskWalletBalance,
    }),
    dataLoaded() {
      return this.lab && this.service && this.order;
    },
  },
  mounted() {
    this.coinName = process.env.VUE_APP_DEGENICS_USE_TOKEN_NAME;
    this.fetchOrderDetails();
  },
  watch: {
    lastEventData() {
      if (this.lastEventData != null) {
        if (this.lastEventData.method == "OrderCancelled") {
          console.log(this.lastEventData.method);
          const dataEvent = JSON.parse(this.lastEventData.data.toString());
          if (dataEvent[0].id == this.$route.params.number) {
            this.isLoading = false;
            this.alertTextBtn = "Close";
            this.alertImgPath = "success.png";
            this.alertTextAlert = "Request Test Order Canceled";
            this.dialogAlert = true;
            this.alertType = "cancel";
          }
        } else if (this.lastEventData.method == "OrderPaid") {
          const dataEvent = JSON.parse(this.lastEventData.data.toString());
          if (dataEvent[0].id == this.$route.params.number) {
            this.isLoading = false;
            this.alertTextBtn = "Close";
            this.alertImgPath = "success.png";
            this.alertTextAlert = "Request Test Order Paid";
            this.dialogAlert = true;
            this.alertType = "paid";
          }
        }
      }
    },
  },
  methods: {
    actionAlert() {
      if (this.alertType == "cancel") {
        this.fetchOrderDetails();
      }
      if (this.alertType == "paid") {
        this.fetchOrderDetails();
      }
      this.dialogAlert = false;
    },
    async openMetamask() {
      await startApp();
      if (this.metamaskWalletAddress == "") {
        this.alertTextBtn = "Close";
        this.alertImgPath = "warning.png";
        this.alertTextAlert = "You haven't integrated in Wallet Binding.";
        this.dialogAlert = true;
        this.alertType = "no_acc_eth";
        return;
      }
      const ethSellerAddress = await ethAddressByAccountId(
        this.api,
        this.lab.account_id
      );
      if (ethSellerAddress == null) {
        this.alertTextBtn = "Close";
        this.alertImgPath = "warning.png";
        this.alertTextAlert = "Saller haven't integrated in Wallet Binding.";
        this.dialogAlert = true;
        this.alertType = "no_acc_eth";
        return;
      }
      if (this.metamaskWalletBalance < 0) {
        this.alertTextBtn = "Close";
        this.alertImgPath = "warning.png";
        this.alertTextAlert = "Your balance is empty.";
        this.dialogAlert = true;
        this.alertType = "no_acc_eth";
        return;
      }
      try {
        console.log('VUE_APP_DEGENICS_ESCROW_ETH_ADDRESS', process.env.VUE_APP_DEGENICS_ESCROW_ETH_ADDRESS)
        console.log('VUE_APP_DEGENICS_USE_TOKEN_NAME', process.env.VUE_APP_DEGENICS_USE_TOKEN_NAME)
        const price = await getPrice(this.priceOrder);
        let txreceipts = await transfer({
          seller: process.env.VUE_APP_DEGENICS_ESCROW_ETH_ADDRESS,
          amount: String(price),
          from: this.metamaskWalletAddress,
        });
        this.isLoading = true;
        console.log(txreceipts);
      } catch (err) {
        console.log(err);
        this.alertTextBtn = "Close";
        this.alertImgPath = "warning.png";
        this.alertTextAlert = "Payment via Metamask is canceled by the user.";
        this.dialogAlert = true;
        this.alertType = "cancel_metamask_payment";
        this.isLoading = false;
      }
    },
    showDialogCancelOrder() {
      this.confirmDeleteOrder = true;
    },
    async cancelOrderRequest(status) {
      if (status) {
        try {
          this.isLoading = true;
          await cancelOrder(this.api, this.wallet, this.$route.params.number);
        } catch (err) {
          console.log(err);
          this.isLoading = false;
        }
      }
    },
    async fetchOrderDetails() {
      this.isLoading = true;
      const orderId = this.$route.params.number;
      this.order = await getOrdersDetail(this.api, orderId);
      this.lab = await queryLabsById(this.api, this.order.seller_id);
      this.service = await queryServicesById(this.api, this.order.service_id);
      this.priceOrder = parseFloat(
        this.service.info.price.replaceAll(",", ".")
      ).toFixed(2);
      this.isLoading = false;
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
