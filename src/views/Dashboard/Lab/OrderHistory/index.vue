
<template>
   <div>
      <v-container>
         <v-row>
            <v-col>
               <DataTable
                  :headers="headers"
                  :items="orders"
                  :search="search"
                  :sort-by="['created_at']"
                  :sort-desc="[true]"
                  :loading="isLoading"
                  additional-class="laporan-table"
               >
                  <template v-slot:search-bar>
                     <SearchBar
                        label="Search"
                        @input="search = $event"
                     ></SearchBar>
                  </template>
                  <template v-slot:[`item.actions`]="{ item }">
                     <v-container v-if="item.status == 'Success'">
                        <v-btn
                          :class="buttonClass(item)"
                          dark
                          small
                          width="200"
                          @click="processOrder(item)"
                          >View</v-btn>
                     </v-container>
                     <v-container v-if="item.status == 'Paid' || item.status == 'Unpaid'">
                        <v-btn
                          :class="buttonClass(item)"
                          dark
                          small
                          width="200"
                          @click="processOrder(item)"
                        >Process</v-btn>
                     </v-container>
                  </template>
                  <!-- Rows -->
               </DataTable>
            </v-col>
         </v-row>
      </v-container>
   </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOrdersDetailByAddress } from '@/lib/polkadotProvider/query/orders'
import DataTable from '@/components/DataTable'
import SearchBar from '@/components/DataTable/SearchBar'

export default {
  name: 'LabOrderHistory',
  components: {
    DataTable,
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
    address: '',
    password: '',
    search: '',
    isLoading: false,
  }),
  async mounted() {
    this.isLoading = true
    let orders = await getOrdersDetailByAddress(this.api, this.pair.address)
    orders.sort(
      (a, b) => parseInt(b.created_at) - parseInt(a.created_at)
    )
    for(let i = 0; i < orders.length; i++){
      const order = orders[i]
      order.created_at = (new Date(order.created_at)).toLocaleDateString()
      this.orders.push(order)
    }
    this.isLoading = false
  },
  computed: {
    ...mapGetters({
      api: 'substrate/getAPI',
      pair: 'substrate/wallet',
    }),
  },
  methods: {
    processOrder(item){
      this.$router.push({ name: 'lab-dashboard-process-order', params: { order_id: item.id }})
    },
    buttonClass(item){
      if(item.status == "Success"){
        return "Success"
      }
      return "btn-sending"
    }
  },
}


</script>

<style lang="scss">
@import "../../../../styles/variables.scss";

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
