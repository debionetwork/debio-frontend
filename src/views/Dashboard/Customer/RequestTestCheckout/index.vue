<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" xl="6" lg="8" md="8">
          <v-card class="dg-card" elevation="0" outlined>
            <v-card-title class="px-8">
              <div class="text-h6">Selected Lab</div>
            </v-card-title>
            <v-card-text class="px-8">
              <template v-if="lab">
                <div class="text-subtitle-1">
                  <b>{{ lab.info.name }}</b>
                </div>
                <div class="text-body-2">
                  {{ lab.info.address }}
                </div>
                <div class="text-body-2">{{ city }}, {{ country }}</div>
              </template>
            </v-card-text>
            <div class="px-8">
              <v-divider></v-divider>
            </div>
            <v-card-title class="px-8">
              <div class="text-h6">Selected Products</div>
            </v-card-title>
            <v-card-text class="px-8">
              <div
                v-for="product in products"
                :key="product.serviceName"
                class="d-flex align-center fill-height mb-2"
              >
                <v-row>
                  <v-col cols="12" lg="1" md="1" xl="1">
                    <div class="my-3 ml-0">
                      <v-icon
                        v-if="
                          product.icon &&
                          (product.icon.startsWith('mdi') ||
                            product.icon.startsWith('$'))
                        "
                        color="#BA8DBB"
                        :size="48"
                      >
                        {{ product.icon }}
                      </v-icon>
                      <v-avatar v-else>
                        <img :src="getImageLink(product.icon)" />
                      </v-avatar>
                    </div>
                  </v-col>
                  <v-col cols="12" lg="9" md="9" xl="9">
                    <div class="ml-5">
                      <div class="text-h6">
                        <b>{{ product.serviceName }}</b>
                      </div>
                      <div class="text-caption grey--text text--darken-1">
                        {{ product.serviceData.info.description }}
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" lg="2" md="2" xl="2">
                    <div class="align-self-end pb-2">
                      <span class="text-h6">
                        {{ product.totalPrice }}
                      </span>
                      <span class="primary--text text-caption">
                        {{ product.currency }}
                      </span>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" xl="3" lg="4" md="4" v-if="isProcessed">
          <v-card class="dg-card pb-3" elevation="0" outlined>
            <v-card-text class="px-8">
              <div class="d-flex justify-space-between align-center">
                <v-img src="@/assets/timer-processed.svg" class="mr-4"></v-img>
                <span class="text-body-1">Your payment is being processed. Please wait for the payment confirmation.</span>
              </div>
            </v-card-text>
            <v-card-actions class="px-8">
              <v-btn
                depressed
                color="primary"
                large
                width="100%"
                @click="handleViewTransaction"
              >
                View Transaction
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12" xl="3" lg="4" md="4" v-else>
          <v-card class="dg-card pb-3" elevation="0" outlined>
            <v-card-title class="px-8">
              <div class="text-h6">Order Summary</div>
            </v-card-title>

              <div class="d-flex justify-space-between px-8">
                <div class="text-h7">Price</div>
                <div>
                  <span class="text-h6">
                    {{ price }}
                  </span>
                  <span class="primary--text text-caption">
                    {{ currency }}
                  </span>
                </div>
              </div>


              <div class="d-flex justify-space-between px-8">
                <div class="text-h7">QC Price</div>
                <div>
                  <span class="text-h6">
                    {{ qcPrice }}
                  </span>
                  <span class="primary--text text-caption">
                    {{ currency }}
                  </span>
                </div>
              </div>

            <v-card-text class="px-8">
              <div class="d-flex justify-space-between">
                <div class="text-h6">Total Price</div>
                <div>
                  <span class="text-h6">
                    {{ totalPrice }}
                  </span>
                  <span class="primary--text text-caption">
                    {{ currency }}
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
                @click="onSubmitOrder"
              >
                Submit Order
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <SendPaymentDialog
      :show="sendPaymentDialog"
      :lab="lab"
      :products="products"
      :totalPrice="price"
      :qcPrice="qcPrice"
      @toggle="sendPaymentDialog = $event"
      @payment-sent="onPaymentSent"
    ></SendPaymentDialog>
    <DialogAlert
      :show="dialogAlert"
      :btnText="alertTextBtn"
      :titleAlert="alertTitleAlert"
      :textAlert="alertTextAlert"
      :imgPath="alertImgPath"
      :imgWidth="imgWidth"
      @toggle="dialogAlert = $event"
      @close="actionAlert()"
    ></DialogAlert>
    <WalletBinding
      :show="showWalletBinding"
      @toggle="showWalletBinding = $event"
      @status-wallet="({ status, img }) => connectWalletResult(status, img)"
    >
    </WalletBinding>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import SendPaymentDialog from "./SendPaymentDialog";
import cityData from "@/assets/json/city.json";
import { ethAddressByAccountId } from "@/lib/polkadotProvider/query/userProfile";
import DialogAlert from "@/components/Dialog/DialogAlert";
import { getBalanceETH } from "@/lib/metamask/wallet.js";
import { ORDER_PROCESSED } from "@/constants/specimen-status"
import WalletBinding from "@/components/WalletBinding";
import localStorage from '@/lib/local-storage'

export default {
  components: {
    SendPaymentDialog,
    DialogAlert,
    WalletBinding
  },
  data: () => ({
    ORDER_PROCESSED,
    sendPaymentDialog: false,
    country: "",
    city: "",
    dialogAlert: false,
    alertTextBtn: "",
    alertImgPath: "warning.png",
    alertTitleAlert: "",
    alertTextAlert: "",
    isProcessed: false,
    imgWidth: "50",
    currency: "",
    totalPrice: "",
    showWalletBinding: false
  }),
  computed: {
    ...mapState({
      lab: (state) => state.testRequest.lab,
      products: (state) => state.testRequest.products,
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      lastEventData: (state) => state.substrate.lastEventData,
      configApp: (state) => state.auth.configApp,
      metamaskWalletAddress: (state) => state.metamask.metamaskWalletAddress,
    }),
    price() {
      return this.products
        .reduce(
          (sum, { price }) => (sum += parseInt(price.replaceAll(",", "."))),
          0
        )
        .toFixed(2);
    },
    qcPrice() {
      return this.products
        .reduce(
          (sum, { additionalPrices }) =>
            (sum += parseInt(additionalPrices.replaceAll(",", "."))),
          0
        )
        .toFixed(2);
    },
    onProcessed: {
      get() {
        return this.isProcessed
      },

      set(val) {
        this.isProcessed = val
      }
    },
  },

  watch: {
    lastEventData() {
      this.checkLastOrder()
    }
  },

  mounted() {
    this.checkingData()
    this.checkLastOrder()
  },
  methods: {
    ...mapMutations({
      clearTestRequest: "testRequest/CLEAR_TEST_REQUEST",
    }),

    async handleViewTransaction() {
      window.open(`https://rinkeby.etherscan.io/address/${this.metamaskWalletAddress}`, "_blank")
    },
    async onSubmitOrder() {
      const ethAddress = await ethAddressByAccountId(
        this.api,
        this.wallet.address
      );
      if (ethAddress != null && ethAddress != "") {
        const balance = await getBalanceETH(this.metamaskWalletAddress);
        if (balance > 0) {
          this.sendPaymentDialog = true;
          localStorage.removeLocalStorageByName("lastOrderStatus")
          this.checkLastOrder()
        } else {
          this.alertTitleAlert = "Payment Failed!"
          this.alertTextAlert = "Your payment failed due to insufficient fund. Please check your wallet balance before making a transaction."
          this.alertTextBtn= "Continue"
          this.dialogAlert = true;
        }
      } else {
        this.alertTitleAlert = "Payment Failed!"
        this.alertTextAlert = "You have not connected to any wallet. Please do a wallet binding to continue your transaction."
        this.alertTextBtn= "Connect to wallet"
        this.dialogAlert = true;
      }
    },
    onPaymentSent(receipts) {
      this.sendPaymentDialog = false;
      this.clearTestRequest();

      this.$router.push({ name: "request-test-receipt", params: { receipts } });
    },
    checkLastOrder() {
      const status = localStorage.getLocalStorageByName("lastOrderStatus")
      this.onProcessed = status && status === ORDER_PROCESSED ? true : false
    },
    async checkingData() {
      if (this.lab == null) {
        this.$router.push({ name: "request-test" });
      } else {
        this.country = cityData[this.lab.info.country].name;
        this.city =
          cityData[this.lab.info.country].divisions[this.lab.info.city];

        if (this.products.length > 0) {
          this.currency = this.products[0].currency;
        }
      }
      this.totalProductPrice()
    },
    getImageLink(val) {
      if (val && val != "") {
        return val;
      }
      return "https://ipfs.io/ipfs/QmaGr6N6vdcS13xBUT4hK8mr7uxCJc7k65Hp9tyTkvxfEr";
    },
    actionAlert() {
      if (this.alertTextBtn == "Continue") {
        this.dialogAlert = false;
      } else { 
        this.showWalletBinding = true
      }
    },
    connectWalletResult(status, img) {
      if (status) {
        this.alertImgPath = img;
        this.dialogAlert = true;
      }
    },
    totalProductPrice() {
      let products = this.products[0]
      console.log(products, 'prod di checkout')
      let productPrice = 0
      productPrice = parseFloat(products.price.toString().replaceAll(",", ".")).toFixed(2);

      let productQcPrice = 0
      productQcPrice = parseFloat(products.additionalPrices.toString().replaceAll(",", ".")).toFixed(2);

      this.totalPrice = (parseFloat(productPrice) + parseFloat(productQcPrice)).toFixed(2)
    }
  },
};
</script>

<style>
</style>
