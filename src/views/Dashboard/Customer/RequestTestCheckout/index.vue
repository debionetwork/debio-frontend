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
                        {{ product.price }}
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
        <v-col cols="12" xl="3" lg="4" md="4">
          <v-card class="dg-card pb-3" elevation="0" outlined>
            <v-card-title class="px-8">
              <div class="text-h6">Order Summary</div>
            </v-card-title>
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
      :totalPrice="totalPrice"
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
      @click="bindingWallet()"
      @close="actionAlert()"
    ></DialogAlert>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import SendPaymentDialog from "./SendPaymentDialog";
import cityData from "@/assets/json/city.json";
import { ethAddressByAccountId } from "@/lib/polkadotProvider/query/userProfile";
import DialogAlert from "@/components/Dialog/DialogAlert";
import { getBalanceETH } from "@/lib/metamask/wallet.js";

export default {
  components: {
    SendPaymentDialog,
    DialogAlert,
  },
  data: () => ({
    sendPaymentDialog: false,
    country: "",
    city: "",
    dialogAlert: false,
    alertTextBtn: "Continue",
    alertImgPath: "warning.png",
    alertTitleAlert: "",
    alertTextAlert: "",
    imgWidth: "50",
    currency: "",
  }),
  computed: {
    ...mapState({
      lab: (state) => state.testRequest.lab,
      products: (state) => state.testRequest.products,
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      configApp: (state) => state.auth.configApp,
      metamaskWalletAddress: (state) => state.metamask.metamaskWalletAddress,
    }),
    totalPrice() {
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
  },
  mounted() {
    this.checkingData();
  },
  methods: {
    ...mapMutations({
      clearTestRequest: "testRequest/CLEAR_TEST_REQUEST",
    }),
    async onSubmitOrder() {
      const ethAddress = await ethAddressByAccountId(
        this.api,
        this.wallet.address
      );
      if (ethAddress != null && ethAddress != "") {
        const balance = await getBalanceETH(this.metamaskWalletAddress);
        if (balance > 0) {
          console.log("balance >>", balance);
          this.sendPaymentDialog = true;
        } else {
          this.alertTitleAlert = "Payment Failed!"
          this.alertTextAlert = "Your payment failed due to insufficient fund. Please check your wallet balance before making a transaction."
          this.dialogAlert = true;
        }
      } else {
        this.alertTitleAlert = "Payment Failed!"
        this.alertTextAlert = "You have not connected to any wallet. Please do a wallet binding to continue your transaction."
        this.dialogAlert = true;
      }
    },
    onPaymentSent(receipts) {
      this.sendPaymentDialog = false;
      this.clearTestRequest();

      this.$router.push({ name: "request-test-receipt", params: { receipts } });

      console.log("Receipt in RequestTestCheckout", receipts);
    },
    checkingData() {
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
    },
    getImageLink(val) {
      if (val && val != "") {
        return val;
      }
      return "https://ipfs.io/ipfs/QmaGr6N6vdcS13xBUT4hK8mr7uxCJc7k65Hp9tyTkvxfEr";
    },
    actionAlert() {
      this.dialogAlert = false;
    },
  },
};
</script>

<style>
</style>
