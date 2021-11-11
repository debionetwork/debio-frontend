<template>
  <div>
    <div class="secondary--text mb-2"><b>Test Results</b></div>
    <div v-if="testResults.length == 0 && !isLoadingTestResults">
      No test results found
    </div>
    <v-progress-linear
      v-if="testResults.length == 0 && isLoadingTestResults"
      class="mt-2"
      indeterminate
      color="primary"
    ></v-progress-linear>
    <template v-if="testResults.length > 0">
      <div
        v-for="order in testResults"
        :key="order.number"
        class="mb-2"
        @click="gotoResult(order)"
      >
        <OrderCard
          :icon="order.icon"
          :title="order.title"
          :specimenNumber="order.number"
          :labName="order.labName"
          :timestamp="order.timestamp"
          :orderDate="order.orderDate"
        />
      </div>
      <PrimaryButton @click="goToTestResults">Show all results</PrimaryButton>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import OrderCard from "@/components/OrderCard";
import PrimaryButton from "@/components/PrimaryButton";
import { SUCCESS } from "@/constants/specimen-status";
import {
  queryDnaTestResultsByOwner,
  queryDnaTestResults,
} from "@/lib/polkadotProvider/query/geneticTesting";
import { queryLabsById } from "@/lib/polkadotProvider/query/labs";
import { queryServicesById } from "@/lib/polkadotProvider/query/services";
import { getOrdersData } from "@/lib/polkadotProvider/query/orders";

export default {
  name: "TestResults",
  components: {
    OrderCard,
    PrimaryButton,
  },
  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      lastEventData: (state) => state.substrate.lastEventData,
    }),
  },
  watch: {
    lastEventData() {
      if (this.lastEventData != null) {
        const dataEvent = JSON.parse(this.lastEventData.data.toString());
        if (this.lastEventData.section == "geneticTesting") {
          if (dataEvent[0].ownerId == this.wallet.address) {
            this.getTestResults();
          }
        }
      }
    },
  },
  mounted() {
    this.getTestResults();
  },
  data: () => ({
    testResults: [],
    isLoadingTestResults: false,
  }),
  methods: {
    async getTestResults() {
      this.isLoadingTestResults = true;
      try {
        this.testResults = [];
        let maxResults = 3;
        // Get specimens
        const specimens = await queryDnaTestResultsByOwner(
          this.api,
          this.wallet.address
        );

        if (specimens != null) {
          specimens.reverse();
          if (specimens.length < maxResults) {
            maxResults = specimens.length;
          }
          for (let i = 0; i < maxResults; i++) {
            const dnaTestResults = await queryDnaTestResults(
              this.api,
              specimens[i]
            );
            if (dnaTestResults != null) {
              const detaillab = await queryLabsById(
                this.api,
                dnaTestResults.labId
              );
              const detailOrder = await getOrdersData(
                this.api,
                dnaTestResults.orderId
              );
              const detailService = await queryServicesById(
                this.api,
                detailOrder.serviceId
              );
              this.prepareOrderData(dnaTestResults, detaillab, detailService);
            }
          }
        }

        this.isLoadingTestResults = false;
      } catch (err) {
        console.log(err);
        this.isLoadingTestResults = false;
      }
    },
    prepareOrderData(dnaTestResults, detaillab, detailService) {
      const title = detailService.info.name;

      const labName = detaillab.info.name;
      let icon = "mdi-needle";
      if (detailService.info.image != null) {
        icon = detailService.info.image;
      }

      let dateSet = new Date();
      let timestamp = dateSet.getTime().toString();
      if (dnaTestResults.updatedAt != null) {
        dateSet = new Date(
          parseInt(dnaTestResults.updatedAt.replace(/,/g, ""))
        );
        timestamp = dateSet.getTime().toString();
      }
      const orderDate = dateSet.toLocaleString("en-US", {
        weekday: "short", // long, short, narrow
        day: "numeric", // numeric, 2-digit
        year: "numeric", // numeric, 2-digit
        month: "long", // numeric, 2-digit, long, short, narrow
        hour: "numeric", // numeric, 2-digit
        minute: "numeric",
      });

      const number = dnaTestResults.trackingId;
      const status = SUCCESS;

      const order = {
        icon,
        title,
        number,
        labName,
        timestamp,
        status,
        orderDate,
      };

      this.testResults.push(order);
    },
    goToTestResults() {
      this.$router.push({
        name: "all-test-result",
      });
    },
    gotoResult(item) {
      this.$router.push({
        name: "result-test",
        params: { number: item.number },
      });
    },
  },
};
</script>

<style>
</style>
