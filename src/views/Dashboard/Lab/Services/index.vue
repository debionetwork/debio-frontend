
<template>
   <div>
      <v-container>
         <v-row>
            <v-col>
                <v-container
                    class="d-flex flex-row-reverse"
                >
                    <v-btn
                        color="primary"
                        class="mb-5"
                        @click="$router.push({name:'lab-dashboard-add-services'})"
                    > 
                        <v-icon 
                        inline
                        color="white"
                        :size="20"
                        >mdi-plus</v-icon>
                        Add Service
                    </v-btn>
                </v-container>
               <DataTable
                  :headers="headers"
                  :items="services"
                  :search="search"
                  :sort-by="['timestamp']"
                  :sort-desc="[true]"
                  :loading="isLoading"
                  additional-class="laporan-table"
               >
                  <template v-slot:search-bar>
                     <SearchBar
                        label="Search"
                        @input="onSearchInput"
                     ></SearchBar>
                  </template>
                  <template v-slot:[`item.info.image`]="{ item }">
                     <v-container rounded>
                        <div v-if="isIcon(item.info.image)" class="d-flex justify-center">
                           <v-icon color="#BA8DBB" :size="48">
                              {{ item.info.image }}
                           </v-icon>
                        </div>
                        <v-img 
                           v-if="item.info.image"
                           :src="item.info.image" 
                           :alt="item.name" 
                           max-height="70px"
                           max-width="70px"
                        ></v-img>
                        <v-img 
                           v-else
                           src="@/assets/debio-logo.png" 
                           :alt="item.name" 
                           max-height="70px"
                           max-width="70px"
                        ></v-img>
                     </v-container>
                  </template>
                  
                  <template v-slot:[`item.info.price`]="{ item }">
                     <span> {{ formatPrice(item.info.price) }} </span>
                  </template>
                   

                  <template v-slot:[`item.actions`]="{ item }">
                     <v-container class="d-flex">
                        <v-btn
                           elevation="0"
                           color="transparent"  
                           @click="gotoDetails(item)"
                        >
                           <v-icon dark>
                              mdi-pencil
                           </v-icon>
                        </v-btn>
                        <v-btn
                           elevation="0"
                           color="transparent"
                           @click="deleteService(item)"
                        >
                           <v-icon dark>
                              mdi-delete
                           </v-icon>
                        </v-btn>
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
import DataTable from '@/components/DataTable'
import SearchBar from '@/components/DataTable/SearchBar'
import { deleteService } from '@/lib/polkadotProvider/command/services'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'LabServices',
  components: {
    DataTable,
    SearchBar,
  },
  data: () => ({
    headers: [
        { text: 'Image', value: 'info.image' },
        { text: 'Name', value: 'info.name' },
        { text: 'Description', value: 'info.description' },
        { text: 'Price', value: 'info.price' },
        { text: 'Action', value: 'actions', sortable: false, align: 'center', width: '10%' },
    ],
    search: '',
    services: [],
    isLoading: false,
  }),
  computed:{
   ...mapGetters({
      api: 'substrate/getAPI',
      pair: 'substrate/wallet',
      web3: 'metamask/getWeb3'
   }),

   ...mapState({
      lastEventData: (state) => state.substrate.lastEventData
   })
  },

  watch: {
    lastEventData(val) {
        if (val === null) return
        if (val.method === "ServiceDeleted") {
        this.isLoading = false
        this.getServices()
      }
    }
  },

   async created() {
      await this.getServices()
   },

  methods:{
   async getServices() {
      const { labAccount: { services } } = await this.$store.dispatch("substrate/getLabAccount")
      this.services = services
   },
   onSearchInput(val) {
      this.search = val
   },
   gotoDetails({ id }){
      this.$router.push({ name: 'lab-dashboard-services-detail', params: { id: id }})
   },
   getImageLink(val){
      if(val && val != ""){
         return val
      }
      return "https://ipfs.io/ipfs/QmaGr6N6vdcS13xBUT4hK8mr7uxCJc7k65Hp9tyTkvxfEr"
   },
   formatPrice(price) {
      const priceAndCurrency = price.replace(/,/g, "").split(" ")
      const formatedPrice = this.web3.utils.fromWei(String(priceAndCurrency[0], 'ether'))
      return `${formatedPrice} ${priceAndCurrency[1]}`
   },
   isIcon(imageName) {
      return imageName && (imageName.startsWith('mdi') || imageName.startsWith('$dgi'))
   },
   async deleteService(item) {
      const isConfirmed = confirm("Are you sure you want to delete this service?")
      if(isConfirmed)  {
         this.isLoading = true
         await deleteService(
            this.api,
            this.pair,
            item.id
         )
      }
    },
  }
}


</script>

<style lang="scss">
@import "../../../../styles/variables.scss";

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
