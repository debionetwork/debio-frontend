<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <ServerSideDataTable
            :headers="headers"
            :items="orders"
            :search="search"
            :sort-by="['createdAt']"
            :sort-desc="[true]"
            :loading="isLoading"
            :total-item-length="totalOrders"
            :handle-page-change="handlePageChange"
            :handle-page-size-change="handlePageSizeChange"
            :current-page="page"
            :page-size="pageSize"
            additional-class="laporan-table"
          >
            <template v-slot:search-bar>
              <SearchBar
                label="Search"
                @input="handleSearch"
              />
            </template>

            <template v-slot:[`item.status`]="{ item }">
              <span> {{ getStatus(item._source.dna_sample_status, item._source.testResult) }} </span>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <v-container>
                <v-btn
                  v-if="item._source.status != 'Cancelled'"
                  :class="buttonClass(item)"
                  dark
                  small
                  width="200"
                  @click="processOrder(item)"
                >
                  {{ actionButton(item._source.dna_sample_status ) }}
                </v-btn>
              </v-container>
            </template>
            <!-- Rows -->
          </ServerSideDataTable>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ServerSideDataTable from '@/components/DataTable/ServerSideDataTable'
import { queryDnaSamples, queryDnaTestResults } from '@/lib/polkadotProvider/query/geneticTesting'
import SearchBar from '@/components/DataTable/SearchBar'
import { getOrdersData } from '@/lib/api'
import serviceHandler from '@/lib/metamask/mixins/serviceHandler'

export default {
  name: 'LabOrderHistory',
  mixins: [serviceHandler],

  components: {
    ServerSideDataTable,
    SearchBar,
  },

  data: () => ({
    headers: [
      { text: 'Date', value: '_source.created_at' },
      { text: 'Product Name', value: '_source.service_info.name' },
      { text: 'Specimen Number', value: '_source.dna_sample_tracking_id' },
      { text: 'Status', value: 'status' },
      { text: 'Actions', value: 'actions', sortable: false, align: 'center', width: '5%' },
    ],
    orders: [],
    page: 1,
    pageSize: 10,
    totalOrders: 0,
    address: '',
    password: '',
    search: '',
    isLoading: false,
  }),

  async created() {
    this.fetchDataOrders()
  },

  computed: {
    ...mapGetters({
      api: 'substrate/getAPI',
      pair: 'substrate/wallet',
    }),
  },
  methods: {
    async fetchDataOrders(keyword) {
      this.orders = []
      const orders = await this.dispatch(getOrdersData, this.pair.address, this.page, this.pageSize, keyword)
      for (let order of orders.data) {
        const dna = await queryDnaSamples(this.api, order._source.dna_sample_tracking_id)
        const dnaTestResult = await queryDnaTestResults(this.api, order._source.dna_sample_tracking_id)
        const data = {
          ...order,
          _source: {
            ...order._source,
            dna_sample_status: dna?.status,
            testResult: dnaTestResult,
            created_at: new Date(+order._source.created_at.replaceAll(",", "")).toLocaleDateString("id", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            })
          }
        }

        this.orders.push(data)
      }
      this.totalOrders = orders.info.count
    },

    async handleSearch(val) {
      this.page = 1
      await this.fetchDataOrders(val)
    },

    processOrder(item){
      this.$router.push({ name: 'lab-dashboard-process-order', params: { orderId: item._source.id }})
    },

    buttonClass(item){
      if(item.status == "Success"){
        return "Success"
      }
      return "btn-sending"
    },
    
    getStatus(status, testResult){
      if (status === "Registered") {
        return "Registered"
      }

      if (status === "Arrived") {
        return "Received"
      }

      if (status === "QualityControlled") {
        return "Quality Controlled"
      }

      if (status === "WetWork" && testResult) {
        return "Upload Result"
      }

      if (status === "WetWork") {
        return "Analyzed"
      }

      if (status === "ResultReady") {
        return "Result Ready"
      }

      if (status === "QualityControlled") {
        return "Quality Controlled"
      }

      return status
    },

    actionButton(status){
      if (status === "Rejected" || status === "ResultReady") {
        return "Details"
      }
      return "Proceed"
    },

    async handlePageChange(value){
      this.page = value
      await this.fetchDataOrders()
    },

    async handlePageSizeChange(value){
      this.pageSize = value
      this.page = 1 // If change page size restart from page 1
      await this.fetchDataOrders()
    }
  },
}
</script>

<style lang="scss">
@import "@/styles/variables.scss";

.btn-sending {
  background-color: $color-primary !important;
}

.Sending {
  background-color: $color-primary !important;
}

.Received {
  background-color: $color-status-received !important;
}

.Success {
  background-color: $color-status-success !important;
}

.Reject {
  background-color: $color-status-reject !important;
}

</style>
