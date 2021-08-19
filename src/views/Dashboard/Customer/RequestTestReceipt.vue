<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" lg="6" md="6" xl="5">
          <v-alert
            type="success"
            rounded="true"
            class="rounded-lg"
            color="#6edaa8"
          >
            <b>Request Test Success</b>
          </v-alert>
          <v-card class="dg-card" elevation="0" outlined>
            <v-card-title class="px-8">
              <div class="text-h6">Order Receipt</div>
            </v-card-title>
            <v-card-text class="px-8">
              <div class="text-h5">Lab Details</div>
              <div v-if="lab">
                <div class="text-subtitle-1">
                  <b>{{ lab.info.name }}</b>
                </div>
                <div class="text-body-2">
                  {{ lab.info.address }}
                </div>
                <div class="text-body-2">{{ city }}, {{ country }}</div>
                <!-- <div v-if="lab.phone" class="text-body-2"> -->
                <!-- Phone: {{ lab.phone }} -->
                <!-- </div> -->
              </div>
              <div class="my-8"></div>
              <div class="text-h5">Product Details</div>
              <div
                v-for="receipt in receipts"
                :key="receipt.productDetail.accountId"
              >
                <div class="d-flex align-center fill-height mb-2">
                  <div class="my-3 ml-0">
                    <v-icon
                      v-if="isValidIcon(receipt.productDetail.icon)"
                      color="#BA8DBB"
                      :size="48"
                    >
                      {{ receipt.productDetail.icon }}
                    </v-icon>
                    <v-avatar v-else>
                      <img src="@/assets/debio-logo.png" />
                    </v-avatar>
                  </div>
                  <div class="ml-5">
                    <div class="text-h6">
                      <b>{{ receipt.productDetail.serviceName }}</b>
                    </div>
                    <div class="text-caption grey--text text--darken-1">
                      {{ receipt.productDetail.serviceData.info.description }}
                    </div>
                  </div>
                  <v-spacer></v-spacer>
                  <div class="align-self-end pb-2">
                    <span class="text-h6">
                      {{ receipt.productDetail.price }}
                    </span>
                    <span class="primary--text text-caption"> DBIO </span>
                  </div>
                </div>
                <div :key="receipt.dataOrder.id">
                  <div><b>Order ID:</b></div>
                  <div class="grey--text text--darken-1">
                    {{ receipt.dataOrder.id }}
                  </div>
                  <div><b>Specimen Number:</b></div>
                  <div class="grey--text text--darken-1">
                    {{ receipt.specimenNumber }}
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" lg="6" md="6" xl="5">
          <v-alert
            type="warning"
            rounded="true"
            class="rounded-lg"
            color="primary"
          >
            <template v-slot:prepend>
              <v-icon color="white" class="mr-4">mdi-alert-circle</v-icon>
            </template>
            <b>You still need to send your samples!</b>
          </v-alert>

          <DNASampleSendingInstructions
            v-if="receipts.length > 0"
            :specimenNumber="specimenNumber"
            :lab="receipts[0].lab"
            :orderId="receipts[0].number"
            :sourcePage="'order-history'"
          >
            <template v-slot:button>
              <v-btn
                depressed
                color="primary"
                large
                width="100%"
                @click="goToHome"
              >
                I understand, bring me back to the home page
              </v-btn>
            </template>
          </DNASampleSendingInstructions>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import DNASampleSendingInstructions from "@/components/DNASampleSendingInstructions";
import cityData from "@/assets/json/city.json";

export default {
  name: "RequestTestSuccess",
  components: {
    DNASampleSendingInstructions,
  },
  data: () => ({
    receipts: [],
    country: "",
    city: "",
  }),
  computed: {
    specimenNumber() {
      const { receipts } = this.$router.history.current.params;
      return receipts[0].specimenNumber;
    },
    lab() {
      const { receipts } = this.$router.history.current.params;
      return receipts[0].lab;
    },
  },
  mounted() {
    const { receipts } = this.$router.history.current.params;
    if (!receipts) {
      this.goToHome();
    }
    this.receipts = receipts;
    if (this.lab != null) {
      this.country = cityData[this.lab.info.country].name;
      this.city = cityData[this.lab.info.country].divisions[this.lab.info.city];
    }
  },
  methods: {
    isValidIcon(icon) {
      return icon && (icon.startsWith("mdi") || icon.startsWith("$"));
    },
    goToHome() {
      this.$router.push({ name: "customer-home" });
    },
  },
};
</script>

<style>
</style>
