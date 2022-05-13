
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

               <Dialog :show="showDialog" @close="showDialog = false" :width='400'>
                  <template v-slot:title>
                     <div></div>
                  </template>
                  <template v-slot:body>
                     <div class="d-flex justify-center pb-1 pt-1">
                        <v-img v-bind:src="require('@/assets/alert-circle.png')" max-width="75" />
                     </div>
                     <div align="center" class="pb-1">Are you sure you want delete this service?</div>
                      <div align="center" class= "ml-5 mr-5 pb-1 d-flex justify-space-between mt-5" >
                        <div>
                          <span style="font-size: 12px"> Estimated Transaction Weight </span>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon
                                color="primary"
                                size="14"
                                v-bind="attrs"
                                v-on="on"
                              > mdi-alert-circle-outline
                              </v-icon>
                            </template>
                            <span style="font-size: 10px;">Total fee paid in DBIO to execute this transaction.</span>
                          </v-tooltip>
                        </div>
                        <span style="font-size: 12px;">
                          {{ Number(fee).toFixed(4) }} DBIO
                        </span>
                      </div>
                  </template>
                  <template v-slot:actions>
                     <v-col col="12" md="6">
                        <Button @click="showDialog = false" elevation="2" color="purple" dark>No</Button>
                     </v-col>
                     <v-col col="12" md="6">
                        <Button @click="deleteService" elevation="2"  dark>Yes</Button>
                     </v-col>
                  </template>
               </Dialog>

               <DataTable
                  :headers="headers"
                  :items="services"
                  :search="search"
                  :sort-by="'info.name'"
                  :sort-desc="[false]"
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
                     <span> {{ formatPrice(item.info.pricesByCurrency) }} </span>
                  </template>

                  <template v-slot:[`item.actions`]="{ item }">
                     <v-container class="d-flex" justify-space-between>
                        <v-icon
                           @click="gotoDetails(item)"
                           color="black"
                        >
                           mdi-pencil
                           </v-icon>

                        <v-tooltip bottom :disabled="!computeButtonStatus">
                          <template v-slot:activator="{ on, attrs }">
                            <div v-bind="attrs" v-on="on">
                              <v-icon
                                 @click="confirmDeleteService(item)"
                                 color="black"
                                 :disabled="computeButtonStatus"
                              >
                                 mdi-delete
                              </v-icon>
                             </div>
                           </template>
                           <span>You need to have at least 1 service</span>
                        </v-tooltip>

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
import DataTable from "@/components/DataTable"
import SearchBar from "@/components/DataTable/SearchBar"
import { deleteService, deleteServiceFee } from "@/lib/polkadotProvider/command/services"
import { mapGetters, mapState } from "vuex"
import Dialog from "@/components/Dialog"
import Button from "@/components/Button"

export default {
  name: "LabServices",
  components: {
    DataTable,
    SearchBar,
    Dialog,
    Button
  },
  data: () => ({
    headers: [
      { text: "Image", value: "info.image", sortable: false },
      { text: "Name", value: "info.name" },
      { text: "Description", value: "info.description" },
      { text: "Price", value: "info.price" },
      { text: "Action", value: "actions", sortable: false, align: "center", width: "10%" }
    ],
    search: "",
    services: [],
    isLoading: false,
    showDialog: false,
    showAlert: false,
    idItemDeleted: "",
    fee: 0
  }),
  computed:{
    ...mapGetters({
      api: "substrate/getAPI",
      pair: "substrate/wallet",
      web3: "metamask/getWeb3",
      labAccount: "substrate/labAccount"
    }),

    ...mapState({
      lastEventData: (state) => state.substrate.lastEventData
    }),

    computeButtonStatus() {
      return this.labAccount?.services?.length === 1 && this.labAccount?.verificationStatus === "Verified"
    }
  },

  watch: {
    lastEventData(val) {
      if (val === null) return
      if (val.method === "ServiceDeleted") {
        this.isLoading = false
        this.showDialog = false
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

      this.services = services.reduce((filtered, service) => {
        if (!filtered.find(v => v.id === service.id)) filtered.push(service)

        return filtered
      }, [])
    },

    onSearchInput(val) {
      this.search = val
    },

    gotoDetails({ id }){
      this.$router.push({ name: "lab-dashboard-services-detail", params: { id: id }})
    },

    getImageLink(val){
      if(val && val != ""){
        return val
      }
      return "https://ipfs.io/ipfs/QmaGr6N6vdcS13xBUT4hK8mr7uxCJc7k65Hp9tyTkvxfEr"
    },

    formatPrice(price) {
      const priceAndCurrency = price[0].totalPrice.replaceAll(",", "").split(" ")
      const formatedPrice = this.web3.utils.fromWei(String(priceAndCurrency, "ether"))
      return `${formatedPrice} ${price[0].currency}`
    },

    isIcon(imageName) {
      return imageName && (imageName.startsWith("mdi") || imageName.startsWith("$dgi"))
    },

    async getDeleteServiceFee() {
      const fee = await deleteServiceFee(this.api, this.pair, this.idItemDeleted)
      this.fee = this.web3.utils.fromWei(String(fee.partialFee), "ether")
    },

    async deleteService() {
      try {
        this.isLoading = true
        await deleteService(
          this.api,
          this.pair,
          this.idItemDeleted
        )
      } catch (error) {
        console.error(error.message)
        this.isLoading = false
      }
    },

    async confirmDeleteService(item) {
      this.idItemDeleted = item.id
      await this.getDeleteServiceFee()
      this.showDialog = true
    }
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
