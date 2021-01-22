<template>
  <div>
    <v-container>
      <v-row>
        <v-col md="4" cols="12">
          <SearchBar
            label="Search"
            @input="search = $event"
          ></SearchBar>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          v-if="testResults.length == 0 && isLoadingTestResults"
        >
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
import Fuse from 'fuse.js'
import { format, fromUnixTime } from 'date-fns'
import SearchBar from '@/components/DataTable/SearchBar'
import OrderCard from "@/components/OrderCard";
import localStorage from "@/lib/local-storage";
import router from "@/router";
import { SUCCESS } from '@/constants/specimen-status'

export default {
  name: "test-result-all",
  components: {
    OrderCard,
    SearchBar
  },
  computed: {
    ...mapState({
      degenicsContract: (state) => state.ethereum.contracts.contractDegenics,
    }),
    userAddress() {
      return JSON.parse(localStorage.getKeystore())["address"];
		},
		searchTestResults() {
			if (!this.search) {
        return this.testResults
      }
      return this.searchableTestResults.search(this.search).map(obj => ({ ...obj.item }))
		}
  },
  mounted() {
    this.getTestResults();
  },
  data: () => ({
    search: '',
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
        keys: ['labName', 'number', 'status', 'title', 'date']
      }
      return new Fuse(list, options)
    },
    async getTestResults() {
      this.isLoadingTestResults = true;
      try {
        // Get specimens
        const specimens = await this.getSuccessSpecimens();
        // Get labs
        const labAccounts = specimens
          .map((item) => item.labAccount)
          .filter((value, index, self) => self.indexOf(value) === index);
        let labs = await this.getLabs(labAccounts);
        labs = await this.fillLabServices(labs);

        const orders = this.prepareOrderData(specimens, labs);
        this.testResults = orders;
        this.searchableTestResults = this.makeSearchableList(orders)

        this.isLoadingTestResults = false;
      } catch (err) {
        console.log(err);
        this.isLoadingTestResults = false;
      }
    },
    async getSuccessSpecimens() {
      try {
        const specimenCount = await this.degenicsContract.methods
          .specimenCount()
          .call({ from: this.userAddress });

        const specimensPromises = [];
        for (let i = specimenCount; i > 0; i--) {
          const promise = this.degenicsContract.methods
            .specimenByIndex(i)
            .call({ from: this.userAddress });

          specimensPromises.push(promise);
        }
        const specimens = await Promise.all(specimensPromises);
        const successSpecimens = specimens.filter(
          (spec) => spec.status == SUCCESS
        )

        return successSpecimens
      } catch (err) {
        console.log(err);
        throw new Error("Error in getting specimens: " + err.message);
      }
    },
    async getLabs(labAccounts) {
      try {
        const labPromises = [];
        for (let i = 0; i < labAccounts.length; i++) {
          const promise = await this.degenicsContract.methods
            .labByAccount(labAccounts[i])
            .call();
          labPromises.push(promise);
        }
        let labs = await Promise.all(labPromises);

        return labs;
      } catch (err) {
        console.log(err);
        throw new Error("Error in getting labs: " + err.message);
      }
    },
    async fillLabServices(labs) {
      try {
        const labWithServicePromises = [];
        for (let i = 0; i < labs.length; i++) {
          let lab = labs[i];
          const { labAccount } = lab;

          const promise = this.degenicsContract.methods
            .serviceCount(labAccount)
            .call()
            .then(async (serviceCount) => {
              const getServicePromises = [];
              for (let i = 1; i <= serviceCount; i++) {
                const promise = await this.degenicsContract.methods
                  .serviceByIndex(labAccount, i)
                  .call();
                getServicePromises.push(promise);
              }
              const services = await Promise.all(getServicePromises);
              lab.services = services;
              return lab;
            });
          labWithServicePromises.push(promise);
        }
        const labWithServices = await Promise.all(labWithServicePromises);

        return labWithServices;
      } catch (err) {
        console.log(err);
        throw new Error("Error in getting lab products: " + err.message);
      }
    },
    /**
     * prepareOrderData
     *
     * @param {Array} specimens
     * @param {Array} labs
     * @returns {Array} productData -- specimen data that includes lab name and product name
     */
    prepareOrderData(specimens, labs) {
      /*
      specimen:
        - date (timestamp) - specimenNumber - status
      lab:
        - labName
      lab product:
        - icon - title
      */
      const orders = [];
      specimens.forEach((spec) => {
        const { number, timestamp, status, labAccount, serviceCode } = spec;
        const lab = labs.filter((l) => l.labAccount == labAccount)[0];
        const product = lab.services.filter(
          (serv) => serv.code == serviceCode
        )[0];
        const productAdditionalData = product.additionalData
          ? JSON.parse(product.additionalData)
          : {};

        const icon = productAdditionalData.icon
          ? productAdditionalData.icon
          : "";
        const title = product.serviceName;
        const labName = lab.name;
        const date = format(fromUnixTime(timestamp), 'MMMM dd yyyy')

        const order = {
          icon,
          title,
          number,
          labName,
          timestamp,
          date,
          status,
        };

        orders.push(order);
      });

      return orders.sort(
        (a, b) => parseInt(b.timestamp) - parseInt(a.timestamp)
      );
    },
    gotoResult(item) {
      router.push(`/result-test/${item.number}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.on-hover {
  cursor: pointer;
}
</style>
