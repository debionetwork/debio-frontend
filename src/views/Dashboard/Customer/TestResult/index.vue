<template>
  <div>
    <v-container>
      <v-row>
        <v-col md="4" cols="12">
          <SearchBar label="Search" @input="search = $event"></SearchBar>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" v-if="testResults.length == 0 && isLoadingTestResults">
          <v-progress-linear
            class="mt-2 px-2"
            indeterminate
            color="primary"
          ></v-progress-linear>
        </v-col>
        <v-col cols="12" class="px-4">
          <div v-if="testResults.length == 0 && !isLoadingTestResults">
            No test results found
          </div>
        </v-col>
        <template v-if="testResults.length > 0">
          <v-col
            cols="12"
            md="4"
            v-for="order in searchTestResults"
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
            />
          </v-col>
        </template>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Fuse from "fuse.js";
import { format, fromUnixTime } from "date-fns";
import SearchBar from "@/components/DataTable/SearchBar";
import OrderCard from "@/components/OrderCard";
import { SUCCESS } from "@/constants/specimen-status";
import {
  queryDnaTestResultsByOwner,
  queryDnaTestResults,
} from "@/lib/polkadotProvider/query/geneticTesting";
import { queryLabsById } from "@/lib/polkadotProvider/query/labs";
import { queryServicesById } from "@/lib/polkadotProvider/query/services";
import { getOrdersDetail } from "@/lib/polkadotProvider/query/orders";

export default {
  name: "test-result-all",
  components: {
    OrderCard,
    SearchBar,
  },
  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
    }),
    searchTestResults() {
      if (!this.search) {
        return this.testResults;
      }
      return this.searchableTestResults
        .search(this.search)
        .map((obj) => ({ ...obj.item }));
    },
  },
  mounted() {
    this.getTestResults();
  },
  watch: {
    $route() {
      this.getTestResults();
    },
  },
  data: () => ({
    search: "",
    searchableTestResults: null,
    testResults: [],
    isLoadingTestResults: false,
  }),
  methods: {
    /**
     * makeSearchableList
     *
     * Make a list of objects fuzzy searchable
     */
    makeSearchableList(list) {
      const options = {
        keys: ["labName", "number", "status", "title", "date"],
      };
      return new Fuse(list, options);
    },
    async getTestResults() {
      this.isLoadingTestResults = true;
      try {
        this.testResults = [];
        const specimens = await queryDnaTestResultsByOwner(
          this.api,
          this.wallet.address
        );

        if (specimens != null) {
          specimens.reverse();
          for (let i = 0; i < specimens.length; i++) {
            const dnaTestResults = await queryDnaTestResults(
              this.api,
              specimens[i]
            );
            if (dnaTestResults != null) {
              const detaillab = await queryLabsById(
                this.api,
                dnaTestResults.lab_id
              );
              const detailOrder = await getOrdersDetail(
                this.api,
                dnaTestResults.order_id
              );
              const detailService = await queryServicesById(
                this.api,
                detailOrder.service_id
              );
              this.prepareOrderData(dnaTestResults, detaillab, detailService);
            }
          }
        }

        this.searchableTestResults = this.makeSearchableList(this.testResults);
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

      let timestamp = Math.floor(Date.now() / 1000).toString();
      if (dnaTestResults.updated_at != null) {
        timestamp = (
          dnaTestResults.updated_at.replace(/,/g, "") / 1000
        ).toString();
      }

      const number = dnaTestResults.tracking_id;
      const status = SUCCESS;

      const date = format(fromUnixTime(timestamp), "MMMM dd yyyy");

      const order = {
        icon,
        title,
        number,
        labName,
        timestamp,
        date,
        status,
      };

      this.testResults.push(order);
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

<style lang="scss" scoped>
.on-hover {
  cursor: pointer;
}
</style>
