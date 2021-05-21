
<template>
   <div>
      <v-container>
         <v-row>
            <v-col>
               <DataTable
                  :headers="headers"
                  :items="orders"
                  :search="search"
                  :sort-by="['timestamp']"
                  :sort-desc="[true]"
                  :loading="isLoading"
                  additional-class="laporan-table"
               >
                  <template v-slot:search-bar>
                     <SearchBar
                        label="Search"
                     ></SearchBar>
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
    this.orders = await getOrdersDetailByAddress(this.api, this.pair.address)
  },
  computed: {
    ...mapGetters({
      api: 'substrate/getAPI',
      pair: 'substrate/wallet',
    }),
  },
  methods: {
    
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

.Succes {
  background-color: $color-status-success !important;
}

.Reject {
  background-color: $color-status-reject !important;
}

</style>
