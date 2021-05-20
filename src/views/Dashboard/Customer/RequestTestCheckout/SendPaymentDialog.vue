<template>
  <v-dialog :value="_show" width="500" persistent>
    <v-card>
      <v-app-bar flat dense color="white">
        <v-toolbar-title class="title"> Send Payment </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <v-card-text class="mt-4 pb-0 text-subtitle-1">
        <!-- Lab Recipient Details -->
        <div v-if="lab">
          <div class="text-h5">Payment Recipient</div>
          <div class="text-body-1 mt-4">
            <b>{{ lab.info.name }}</b>
          </div>
          <div v-if="lab.info.address" class="text-body-2">
            {{ lab.info.address }}
          </div>
          <div class="text-body-2">{{ city }}, {{ country }}</div>
        </div>

        <!-- Payment Details -->
        <div class="mt-6">
          <div class="text-h5">Payment Details</div>
          <div class="d-flex align-center justify-space-between mt-4">
            <div class="text-body-1">
              <b>Total Price</b>
            </div>
            <div>
              <span class="text-h6">
                {{ totalPrice }}
              </span>
              <span class="primary--text text-caption"> USDT </span>
            </div>
          </div>
          <!-- <div class="d-flex align-center justify-space-between">
            <div class="text-body-1">
              <b>Transaction Fee</b>
            </div>
            <div>
              <span class="text-h6">
                {{ transactionFee }}
              </span>
              <span class="text-caption">
                Gwei
              </span>
            </div>
          </div> -->
        </div>

        <!-- Prompt password to sign transaction -->
        <v-text-field
          class="mt-4"
          outlined
          auto-grow
          type="password"
          @keyup.enter="onSubmit"
          v-model="password"
          label="Input your password"
          :disabled="isLoading"
        >
        </v-text-field>
        <v-alert v-if="error" dense text type="error">
          {{ error }}
        </v-alert>
        <v-progress-linear
          v-if="isLoading"
          indeterminate
          color="primary"
        ></v-progress-linear>
      </v-card-text>
      <v-card-actions class="px-6 pb-4">
        <v-btn
          depressed
          color="primary"
          large
          width="100%"
          @click="onSubmit"
          :disabled="!password || isLoading"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
/* eslint-disable */
import { mapState, mapActions } from "vuex";
import cityData from "@/assets/json/city.json";
import { startApp } from "@/lib/metamask";
import { ethAddressByAccountId } from "@/lib/polkadotProvider/query/userProfile";
import {
  lastOrderByCustomer,
  getOrdersDetail,
} from "@/lib/polkadotProvider/query/orders";
import { createOrder } from "@/lib/polkadotProvider/command/orders";
import { setEthAddress } from "@/lib/polkadotProvider/command/userProfile";
import { transfer, addTokenUsdt } from "@/lib/metamask/wallet.js";

export default {
  name: "SendPaymentDialog",
  props: {
    show: Boolean,
    lab: Object,
    totalPrice: [String, Number],
    products: Array,
  },
  data: () => ({
    password: "",
    isLoading: false,
    transactionFee: "TODO",
    error: "",
    country: "",
    city: "",
    receipts: [],
    metamaskStatus: false,
    ethSellerAddress: null,
    ethRegisterAddress: null,
    ethAccount: null,
  }),
  computed: {
    _show: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit("toggle", val);
      },
    },
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      lastEventData: (state) => state.substrate.lastEventData,
    }),
  },
  mounted() {
    if (this.lab != null) {
      console.log(this.lab);
      this.country = cityData[this.lab.info.country].name;
      this.city = cityData[this.lab.info.country].divisions[this.lab.info.city];
    }
  },
  watch: {
    lastEventData() {
      if (this.lastEventData != null) {
        if (
          this.lastEventData.method == "OrderCreated" ||
          this.lastEventData.method == "OrderPaid"
        ) {
          const dataEvent = JSON.parse(this.lastEventData.data.toString());
          let orderStatus = false;
          for (let i = 0; i < dataEvent.length; i++) {
            for (let x = 0; x < this.products.length; x++) {
              const productDetail = this.products[x];
              if (dataEvent[i].service_id == this.products[x].accountId) {
                const specimenNumber = dataEvent[i].dna_sample_tracking_id;
                const dataOrder = dataEvent[i];
                this.receipts.push({
                  dataOrder,
                  specimenNumber,
                  productDetail,
                  lab: this.lab,
                });
                orderStatus = true;
              }
            }
          }
          this.isLoading = false;
          this.password = "";
          if (orderStatus) {
            if (this.lastEventData.method == "OrderPaid") {
              this.$emit("payment-sent", this.receipts);
            } else {
              this.openMetamask();
            }
          }
        }
      }
    },
  },
  methods: {
    ...mapActions({
      restoreAccountKeystore: "substrate/restoreAccountKeystore",
    }),
    async openMetamask() {
      await addTokenUsdt();
      try {
        let txreceipts = await transfer({
          seller: this.ethSellerAddress,
          amount: parseFloat(this.totalPrice),
          from: this.ethRegisterAddress,
        });
        console.log(txreceipts);
      } catch (err) {
        console.log(err);
      }
    },
    async onSubmit() {
      this.isLoading = true;
      this.error = "";
      try {
        this.wallet.decodePkcs8(this.password);
        // Checking seller ready eth Address
        this.ethSellerAddress = await ethAddressByAccountId(
          this.api,
          this.lab.account_id
        );
        if (this.ethSellerAddress == null) {
          this.isLoading = false;
          this.password = "";
          this.error = "The seller has no ETH Address.";
        } else {
          const lastOrder = await lastOrderByCustomer(
            this.api,
            this.wallet.address
          );
          let sendOrder = false;
          if (lastOrder == null) {
            sendOrder = true;
          } else {
            const detailOrder = await getOrdersDetail(this.api, lastOrder);
            if (detailOrder != null) {
              if (detailOrder.status != "Unpaid") {
                sendOrder = true;
              }
            }
          }

          if (sendOrder) {
            this.ethAccount = await startApp();
            if (this.ethAccount.currentAccount == "no_install") {
              this.isLoading = false;
              this.password = "";
              this.error = "Please install MetaMask!";
              return;
            }
            this.ethRegisterAddress = await ethAddressByAccountId(
              this.api,
              this.wallet.address
            );
            if (this.ethRegisterAddress == null) {
              const addResult = await setEthAddress(
                this.api,
                this.wallet,
                this.ethAccount.currentAccount
              );
              this.ethRegisterAddress = this.ethAccount.currentAccount;
              console.log(addResult);
            }
            for (let i = 0; i < this.products.length; i++) {
              await createOrder(
                this.api,
                this.wallet,
                this.products[i].accountId
              );
            }
          } else {
            this.isLoading = false;
            this.password = "";
            this.error = "You still have unpaid orders.";
          }
        }
      } catch (err) {
        console.log(err);
        this.isLoading = false;
        this.password = "";
        this.error = "The password you entered is wrong";
      }
    },
    closeDialog() {
      this._show = false;
      this.password = "";
      this.error = "";
    },
  },
};
</script>

<style>
</style>



