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
            <div class="text-body-2">
              <b>Price</b>
            </div>
            <div>
              <span class="text-h7">
                {{ priceOrder }}
              </span>
              <span class="text-caption">
                {{ currency }}
              </span>
            </div>
          </div>
          <div class="d-flex align-center justify-space-between">
            <div class="text-body-2">
              <b>QC Price</b>
            </div>
            <div>
              <span class="text-h7">
                {{ totalQcPrice }}
              </span>
              <span class="text-caption">
                {{ currency }}
              </span>
            </div>
          </div>
          <div class="d-flex align-center justify-space-between mt-4">
            <div class="text-body-1">
              <b>Total Pay</b>
            </div>
            <div>
              <span class="text-h6">
                {{ totalPay.toFixed(2) }}
              </span>
              <span class="primary--text text-caption">
                {{ currency }}
              </span>
            </div>
          </div>
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
import { mapState, mapActions, mapMutations } from "vuex";
import cityData from "@/assets/json/city.json";
import { startApp, getTransactionReceiptMined } from "@/lib/metamask";
import { ethAddressByAccountId } from "@/lib/polkadotProvider/query/userProfile";
import {
  lastOrderByCustomer,
  getOrdersData,
} from "@/lib/polkadotProvider/query/orders";
import { createOrder } from "@/lib/polkadotProvider/command/orders";
import { setEthAddress } from "@/lib/polkadotProvider/command/userProfile";
import { getBalanceETH } from "@/lib/metamask/wallet.js";
import Kilt from "@kiltprotocol/sdk-js";
import { u8aToHex } from "@polkadot/util";
import { sendPaymentEscrow } from "@/lib/metamask/escrow.js";

export default {
  name: "SendPaymentDialog",
  props: {
    show: Boolean,
    lab: Object,
    totalPrice: [String, Number],
    qcPrice: [String, Number],
    products: Array,
  },
  data: () => ({
    password: "",
    isLoading: false,
    totalQcPrice: 0,
    totalPay: 0,
    error: "",
    country: "",
    city: "",
    receipts: [],
    metamaskStatus: false,
    ethSellerAddress: null,
    ethAccount: null,
    priceOrder: 0,
    currency: "",
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
      metamaskWalletAddress: (state) => state.metamask.metamaskWalletAddress,
      metamaskWalletBalance: (state) => state.metamask.metamaskWalletBalance,
      mnemonic: (state) => state.substrate.mnemonicData.mnemonic,
      configApp: (state) => state.auth.configApp,
    }),
  },
  mounted() {
    if (this.lab != null) {
      this.country = cityData[this.lab.info.country].name;
      this.city = cityData[this.lab.info.country].divisions[this.lab.info.city];

      this.priceOrder = this.totalPrice;
      this.priceOrder = parseFloat(
        this.priceOrder.toString().replaceAll(",", ".")
      ).toFixed(2);

      this.totalQcPrice = this.qcPrice;
      this.totalQcPrice = parseFloat(
        this.totalQcPrice.toString().replaceAll(",", ".")
      ).toFixed(2);

      this.totalPay =
        parseFloat(this.priceOrder) + parseFloat(this.totalQcPrice);

      if (this.products.length > 0) {
        this.currency = this.products[0].currency;
      }
    }
  },
  watch: {
    async lastEventData() {
      if (this.lastEventData != null) {
        if (this.lastEventData.method == "OrderCreated") {
          const dataEvent = JSON.parse(this.lastEventData.data.toString());
          let orderStatus = false;
          let orderId = "";
          for (let i = 0; i < dataEvent.length; i++) {
            if (dataEvent[i].customer_id == this.wallet.address) {
              orderStatus = true;
              orderId = dataEvent[i].id;
            }
          }
          this.isLoading = false;
          this.password = "";

          if (!orderStatus) return;
          
          this.closeDialog();
          const txHash = await sendPaymentEscrow(this.api, orderId, this.ethAccount, this.ethSellerAddress)
          await getTransactionReceiptMined(txHash)
          this.$router.push({
            name: "order-history-detail",
            params: { number: orderId },
          });
          
        }
      }
    },
  },
  methods: {
    ...mapMutations({
      setMetamaskAddress: "metamask/SET_WALLET_ADDRESS",
      setMetamaskBalance: "metamask/SET_WALLET_BALANCE",
      setOpenMetaMask: "metamask/SET_OPEN_PAY_METAMASK",
    }),
    ...mapActions({
      restoreAccountKeystore: "substrate/restoreAccountKeystore",
    }),
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
            const detailOrder = await getOrdersData(this.api, lastOrder);
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
            } else {
              if (
                this.metamaskWalletAddress != null &&
                this.metamaskWalletAddress != ""
              ) {
                if (this.ethAccount.accountList.length > 0) {
                  let statusAddUse = false;
                  for (let x = 0; x < this.ethAccount.accountList.length; x++) {
                    if (
                      this.ethAccount.accountList[x] ==
                      this.metamaskWalletAddress
                    ) {
                      statusAddUse = true;
                    }
                  }
                  this.statusAddUse = false
                  if (statusAddUse == false) {
                    this.isLoading = false;
                    this.password = "";
                    this.error = "The address is not listed on Metamask, please re-bind your wallet before proceeding with the transaction.";
                    return;
                  }
                } else {
                  this.isLoading = false;
                  this.password = "";
                  this.error = "Metamask has no address ETH.";
                  return;
                }
              } else {
                if (this.ethAccount.currentAccount != null) {
                  await setEthAddress(
                    this.api,
                    this.wallet,
                    this.ethAccount.currentAccount
                  );
                  await this.setMetamaskAddress(this.ethAccount.currentAccount);
                  this.metamaskWalletAddress = this.ethAccount.currentAccount;
                } else {
                  this.isLoading = false;
                  this.password = "";
                  this.error = "Metamask has no address.";
                  return;
                }
              }

              const balance = await getBalanceETH(this.metamaskWalletAddress);
              if (balance > 0) {
                const customer_box_public_key = this.getKiltBoxPublicKey();
                for (let i = 0; i < this.products.length; i++) {
                  await createOrder(//customer udah create order, notif dari cust apa dari lab nya.
                    this.api,
                    this.wallet,
                    this.products[i].accountId,
                    customer_box_public_key,
                    this.products[i].indexPrice
                  );
                }
              } else {
                this.isLoading = false;
                this.password = "";
                this.error = "ETH balance is 0";
              }
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
    getKiltBoxPublicKey() {
      const cred = Kilt.Identity.buildFromMnemonic(this.mnemonic);
      return u8aToHex(cred.boxKeyPair.publicKey);
    },
  },
};
</script>

<style>
</style>



