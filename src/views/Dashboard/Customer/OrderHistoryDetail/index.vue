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
                  <v-row>
                    <v-col cols="12" lg="1" md="1" xl="1">
                      <div class="my-3 ml-0">
                        <v-icon
                          v-if="isValidIcon(service.info.image)"
                          color="#BA8DBB"
                          :size="48"
                        >
                          {{ service.info.image }}
                        </v-icon>
                        <v-avatar v-else>
                          <img :src="getImageLink(service.info.image)" />
                        </v-avatar>
                      </div>
                    </v-col>
                    <v-col cols="12" lg="9" md="9" xl="9">
                      <div class="ml-5">
                        <div class="text-h6">
                          <b>{{ service.info.name }}</b>
                        </div>
                        <div class="text-caption grey--text text--darken-1">
                          {{ service.info.description }}
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" lg="2" md="2" xl="2">
                      <div class="align-self-end pb-2">
                        <span class="text-h7">
                          {{ priceOrder }}
                        </span>
                        <span class="primary--text text-caption">
                          {{ coinName }}
                        </span>
                      </div>
                    </v-col>
                  </v-row>
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
        </v-col>
          <!-- If order Success -->
          <v-col cols="12" lg="6" md="6" xl="5" v-if="order.status == ORDER_FULFILLED" class="mt-2">
            <v-card class="dg-card mb-10" elevation="0" outlined>
              <v-card-title class="px-8 p4">
                <div class="text-h6" align="center">Success!</div>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col class="px-8">
                  <h3> Your order has been fulfilled</h3>
                  </v-col>
                </v-row>
                <v-row class="justify-center mt-10 align-center">
                  <v-col cols="12" lg="5" md="5" sm="8" align="center">
                    <Button color="green" @click="goToResult" dark>
                      View Result
                    </Button>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions class="px-8 pb-5">
                <slot name="button"> </slot>
              </v-card-actions>
            </v-card>
            <RatingBox>
            </RatingBox>
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
                <div class="text-h7">Price</div>
                <div>
                  <span class="text-h7">
                    {{ priceOrder }}
                  </span>
                  <span class="primary--text text-caption">
                    {{ coinName }}
                  </span>
                </div>
              </div>
              <div class="d-flex justify-space-between">
                <div class="text-h7">QC Price</div>
                <div>
                  <span class="text-h7">
                    {{ totalQcPrice }}
                  </span>
                  <span class="primary--text text-caption">
                    {{ coinName }}
                  </span>
                </div>
              </div>
              <div class="d-flex justify-space-between">
                <div class="text-h6">Total Price</div>
                <div>
                  <span class="text-h6">
                    {{ totalPay }}
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

        <DialogReward
          :show="dialogReward"
          @toggle="dialogReward = $event"
          @close="dialogReward = false"
        ></DialogReward>

        <!-- If order is sending -->
        <v-col cols="12" lg="6" md="6" xl="5" v-if="order.status == ORDER_PAID">
          <DNASampleSendingInstructions
            :specimenNumber="order.dna_sample_tracking_id"
            :lab="lab"
            :orderId="orderId"
            :sourcePage="'order-history-detail'"
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
import { mapState, mapMutations } from "vuex";
import DNASampleSendingInstructions from "@/components/DNASampleSendingInstructions";
import DialogConfirmWithPassword from "@/components/Dialog/DialogConfirmWithPassword";
import DialogAlert from "@/components/Dialog/DialogAlert";
import StatusChip from "@/components/StatusChip";
import Button from "@/components/Button";
import Refund from "./Refund";
import DialogReward from "@/components/Dialog/DialogReward";
import RatingBox from "@/components/RatingBox"
import {
  ORDER_UNPAID,
  ORDER_PAID,
  ORDER_CANCEL,
  SENDING,
  RECEIVED,
  SUCCESS,
  REJECTED,
  ORDER_REFUNDED,
  ORDER_FULFILLED,
} from "@/constants/specimen-status";
import { getOrdersData } from "@/lib/polkadotProvider/query/orders";
import { queryLabsById } from "@/lib/polkadotProvider/query/labs";
import { queryServicesById } from "@/lib/polkadotProvider/query/services";
import { transfer, getPrice, addToken } from "@/lib/metamask/wallet.js";
import { ethAddressByAccountId } from "@/lib/polkadotProvider/query/userProfile";
import { cancelOrder } from "@/lib/polkadotProvider/command/orders";
import { startApp } from "@/lib/metamask";
import { getBalanceETH } from "@/lib/metamask/wallet.js";

export default {
  name: "RequestTestSuccess",
  components: {
    DNASampleSendingInstructions,
    DialogConfirmWithPassword,
    DialogAlert,
    StatusChip,
    Button,
    Refund,
    DialogReward,
    RatingBox
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
    ORDER_FULFILLED,
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
    dialogReward: false,
    orderId: "",
    totalQcPrice: 0,
    totalPay: 0,
  }),
  computed: {
    ...mapState({
      walletBalance: (state) => state.substrate.walletBalance,
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      lastEventData: (state) => state.substrate.lastEventData,
      metamaskWalletAddress: (state) => state.metamask.metamaskWalletAddress,
      metamaskWalletBalance: (state) => state.metamask.metamaskWalletBalance,
      openPayMetamask: (state) => state.metamask.openPayMetamask,
      configApp: (state) => state.auth.configApp,
    }),
    dataLoaded() {
      return this.lab && this.service && this.order;
    },
  },
  mounted() {
    this.fetchOrderDetails();
  },
  watch: {
    $route() {
      this.fetchOrderDetails();
    },
    lastEventData() {
      if (this.lastEventData != null) {
        const dataEvent = JSON.parse(this.lastEventData.data.toString());
        if (this.lastEventData.section == "orders") {
          if (dataEvent[0].id == this.$route.params.number) {
            this.isLoading = false;
            this.alertTextBtn = "Close";
            this.alertImgPath = "success.png";
            if (this.lastEventData.method == "OrderCancelled") {
              this.alertTextAlert = "Request Test Order Canceled";
              this.dialogAlert = true;
              this.alertType = "cancel";
            }
            if (this.lastEventData.method == "OrderPaid") {
              this.alertTextAlert = "Order Paid";
              this.dialogAlert = true;
              this.alertType = "paid";
            }
            if (this.lastEventData.method == "OrderSuccess") {
              this.dialogReward = true;
            }
            if (this.lastEventData.method == "OrderRefunded") {
              this.fetchOrderDetails();
            }
          }
        }
      }
    },
  },
  methods: {
    ...mapMutations({
      setOpenMetaMask: "metamask/SET_OPEN_PAY_METAMASK",
    }),
    async fetchOrderDetails() {
      this.isLoading = true;
      this.orderId = this.$route.params.number;
      this.order = await getOrdersData(this.api, this.orderId);
      this.coinName = this.order.currency;
      this.priceOrder = parseFloat(
        this.order.prices[0].value.replaceAll(",", ".")
      ).toFixed(2);

      this.totalQcPrice = parseFloat(
        this.order.additional_prices[0].value.replaceAll(",", ".")
      ).toFixed(2);

      this.totalPay = (
        parseFloat(this.priceOrder) + parseFloat(this.totalQcPrice)
      ).toFixed(2);

      this.lab = await queryLabsById(this.api, this.order.seller_id);
      this.service = await queryServicesById(this.api, this.order.service_id);

      if (this.openPayMetamask) {
        console.log(this.order);
        console.log(this.lab);
        console.log(this.service);
        this.openMetamask();
      } else {
        this.isLoading = false;
      }

      if (this.order.status == ORDER_FULFILLED) {
        this.dialogReward = true;
      }
    },
    actionAlert() {
      switch (this.alertType) {
        case "cancel":
          this.fetchOrderDetails();
          break;
        case "paid":
          this.fetchOrderDetails();
          break;
        default:
          this.isLoading = false;
          break;
      }
      this.dialogAlert = false;
    },
    async openMetamask() {
      await startApp();
      this.setOpenMetaMask(false);
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
      const balance = await getBalanceETH(this.metamaskWalletAddress);
      if (balance < 1) {
        this.alertTextBtn = "Close";
        this.alertImgPath = "warning.png";
        this.alertTextAlert = "Your ETH balance is 0.";
        this.dialogAlert = true;
        this.alertType = "no_acc_eth";
        return;
      }

      try {
        await addToken(this.coinName);
        const price = await getPrice(this.totalPay);
        let txreceipts = await transfer({
          seller: this.configApp.escrowETHAddress,
          amount: String(price),
          from: this.metamaskWalletAddress,
        });
        this.isLoading = true;
        console.log(txreceipts);
      } catch (err) {
        console.log(err);
        this.alertTextBtn = "Close";
        this.alertImgPath = "warning.png";
        this.alertTextAlert = "Payment via Metamask is canceled or rejected.";
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
    isValidIcon(icon) {
      return icon && (icon.startsWith("mdi") || icon.startsWith("$"));
    },
    getImageLink(val) {
      if (val && val != "") {
        return val;
      }
      return "https://ipfs.io/ipfs/QmaGr6N6vdcS13xBUT4hK8mr7uxCJc7k65Hp9tyTkvxfEr";
    },
    goToResult() {
      this.$router.push({
        name: "result-test",
        params: { number: this.order.dna_sample_tracking_id },
      });
    },
  },
};
</script>

<style>
</style>
