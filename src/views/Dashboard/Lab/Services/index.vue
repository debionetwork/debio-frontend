
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
                  <template v-slot:[`item.number`]="{ item }">
                    {{ item.number | specimenNumber }}
                  </template>
                  <template v-slot:[`item.timestamp`]="{ item }">
                    {{ item.timestamp | timestampToDate }}
                  </template>
                  <template v-slot:[`item.status`]="{ item }">
                    {{ item.status | customerSpecimenStatus }}
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

export default {
  name: 'LabServices',
  components: {
    DataTable,
    SearchBar,
  },
  data: () => ({
    headers: [
        { text: 'Image', value: 'image' },
        { text: 'Name', value: 'service' },
        { text: 'Description', value: 'description' },
        { text: 'Price', value: 'price' },
        { text: 'Action', value: 'actions', sortable: false, align: 'center', width: '10%' },
    ],
    services: [],
    search: '',
    isLoading: false,
  }),
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