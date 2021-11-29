<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <ServerSideDataTable
            :headers="headers"
            :items="filterResultReady"
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
            <template v-slot:[`item.actions`]="{ item }">
              <v-container>
                <v-btn
                  v-if="item.status != 'Cancelled'"
                  :class="buttonClass(item)"
                  dark
                  small
                  width="200"
                  @click="processOrder(item)"
                >{{ item._source.dna_sample_status }}</v-btn>
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
import { getOrdersDetailByAddressPagination } from '@/lib/polkadotProvider/query/orders'
import ServerSideDataTable from '@/components/DataTable/ServerSideDataTable'
import { queryDnaSamples } from '@/lib/polkadotProvider/query/geneticTesting'
import SearchBar from '@/components/DataTable/SearchBar'
import { getOrdersData } from '@/lib/orders'
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
      { text: 'Status', value: '_source.status' },
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

    filterResultReady() {
      if (this.$route.params.testResult == true) {
        return this.orders.filter(order => order.status == 'Fulfilled')
      }
      return this.orders
    }
  },
  methods: {
    async fetchDataOrders(keyword) {
      this.orders = []
      const orders = await this.dispatch(getOrdersData, this.pair.address, this.page, this.pageSize, keyword)
      for (let order of orders.data) {
        const dna = await queryDnaSamples(this.api, order._source.dna_sample_tracking_id)
        const data = {
          ...order,
          _source: {
            ...order._source,
            dna_sample_status: dna?.status,
            created_at: (new Date(parseInt(order._source.created_at))).toLocaleDateString()
          }
        }

        this.orders.push(data)
      }
      this.totalOrders = orders.info.count
    },

    async loadData(){
      this.isLoading = true
      this.orders = []
      let { orders, totalOrders } = await getOrdersDetailByAddressPagination(this.api, this.pair.address, this.page, this.pageSize)
      for(let i = 0; i < orders.length; i++){
        const order = orders[i]
        order.createdAt = (new Date(order.createdAt)).toLocaleDateString()
        this.orders.push(order)
      }
      this.totalOrders = totalOrders
      this.isLoading = false
    },

    async handleSearch(val) {
      await this.fetchDataOrders(val)
    },

    processOrder(item){
      this.$router.push({ name: 'lab-dashboard-process-order', params: { orderId: item.id }})
    },

    buttonClass(item){
      if(item.status == "Success"){
        return "Success"
      }
      return "btn-sending"
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
