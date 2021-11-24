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
    />
    <template v-if="testResults.length > 0">
      <div
        v-for="order in testResults"
        :key="order.id"
        class="mb-2"
        @click="gotoResult(order.id)"
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
  getDnaTestResultsDetailByLab,
} from "@/lib/polkadotProvider/query/geneticTesting"

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
    }),
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
        let dnaTestResults = await getDnaTestResultsDetailByLab(
          this.api,
          this.wallet.address
        )
        dnaTestResults.sort(
          (a, b) => parseInt(b.createdAt) - parseInt(a.createdAt)
        )
        if(dnaTestResults.length > 0){
          for (let i = 0; i < maxResults; i++) {
            this.prepareOrderData(dnaTestResults[i])
          }
        }

        this.isLoadingTestResults = false;
      } catch (err) {
        this.isLoadingTestResults = false;
      }
    },

    prepareOrderData(dnaTestResults) {
      const title = dnaTestResults.order.service_name;
      const labName = dnaTestResults.order.lab_name;
      let icon = "mdi-needle";
      if (dnaTestResults.order.image != null) {
        icon = dnaTestResults.order.image;
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

      const id = dnaTestResults.order.id;
      const number = dnaTestResults.trackingId;
      const status = SUCCESS;

      const order = {
        id,
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
        name: "lab-dashboard-order-history",
        params: { testResult: true }
      });
    },

    gotoResult(id) {
      this.$router.push({
        name: "lab-dashboard-process-order",
        params: { orderId: id },
      });
    },
  },
};
</script>

<style>
</style>
