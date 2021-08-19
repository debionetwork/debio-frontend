
<template>
   <div>
      <v-container>
         <v-row>
            <v-col>
               <ServerSideDataTable
                  :headers="headers"
                  :items="orders"
                  :search="search"
                  :sort-by="['created_at']"
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
                        @input="search = $event"
                     ></SearchBar>
                  </template>
                  <template v-slot:[`item.dna_sample_tracking_id`]="{ item }">
                    {{ item.dna_sample_tracking_id }}
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
                        >{{ item.dna_sample_status }}</v-btn>
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
import SearchBar from '@/components/DataTable/SearchBar'

export default {
  name: 'LabOrderHistory',
  components: {
    ServerSideDataTable,
    SearchBar,
  },
  data: () => ({
    headers: [
      { text: 'Date', value: 'created_at' },
      { text: 'Product Name', value: 'service_name' },
      { text: 'Specimen Number', value: 'dna_sample_tracking_id' },
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
  async mounted() {
    this.loadData()
  },
  computed: {
    ...mapGetters({
      api: 'substrate/getAPI',
      pair: 'substrate/wallet',
    }),
  },
  methods: {
    async loadData(){
      this.isLoading = true
      this.orders = []
      let { orders, totalOrders } = await getOrdersDetailByAddressPagination(this.api, this.pair.address, this.page, this.pageSize)
      for(let i = 0; i < orders.length; i++){
        const order = orders[i]
        order.created_at = (new Date(order.created_at)).toLocaleDateString()
        this.orders.push(order)
      }
      this.totalOrders = totalOrders
      this.isLoading = false
    },
    processOrder(item){
      this.$router.push({ name: 'lab-dashboard-process-order', params: { order_id: item.id }})
    },
    buttonClass(item){
      if(item.status == "Success"){
        return "Success"
      }
      return "btn-sending"
    },
    async handlePageChange(value){
      this.page = value
      await this.loadData()

    },
    async handlePageSizeChange(value){
      this.pageSize = value
      this.page = 1 // If change page size restart from page 1
      await this.loadData()
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
