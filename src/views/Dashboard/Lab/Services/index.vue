
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
                     ></SearchBar>
                  </template>
                  <template v-slot:[`item.actions`]="{ item }">
                     <v-container
                     >
                        <v-btn
                          class="btn-sending"
                          dark
                           small
                           width="200"
                           @click="showDialogInstruction(item)"
                           >View Instructions</v-btn
                        >
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
import { mapGetters } from 'vuex'

export default {
  name: 'LabServices',
  components: {
    DataTable,
    SearchBar,
  },
  data: () => ({
    headers: [
        { text: 'Image', value: 'image' },
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
        { text: 'Price', value: 'price' },
        { text: 'Action', value: 'actions', sortable: false, align: 'center', width: '10%' },
    ],
    services: [{
       name: 'name',
       image: 'image',
       description: 'description',
       price: 'price',
       action: 'action'
    }],
    search: '',
    isLoading: false,
  }),
  async mounted(){
     this.services.pop()
     const labServices = this.labAccount.services
     for(let i = 0; i < labServices.length; i++){
        let s = {}
        s["name"] = labServices[i].info.name
        s["image"] = labServices[i].info.image
        s["price"] = labServices[i].info.price
        s["description"] = labServices[i].info.description
        s["action"] = 'action'
        this.services.push(s)
     }
  },
  computed:{
    ...mapGetters({
      labAccount: 'substrate/labAccount',
    }),
  }
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