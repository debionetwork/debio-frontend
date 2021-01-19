
<template>
   <div>
      <v-container>
         <v-row>
            <v-col>
               <v-dialog v-model="dialogInstruction" max-width="600px">
                  <DNASampleSendingInstructions
                     :specimenNumber="selectedSpeciment.number"
                     :lab="selectedSpeciment.labData"
                  >
                     <template v-slot:button>
                        <v-btn
                           depressed
                           color="primary"
                           large
                           width="100%"
                           @click="() => (dialogInstruction = false)"
                        >
                           Dismis
                        </v-btn>
                     </template>
                  </DNASampleSendingInstructions>
               </v-dialog>
               <v-dialog v-model="dialogRejected" max-width="600px">
                 <RejectedReasonDialog
                    :specimen="selectedSpeciment"
                 >
                  <template v-slot:button>
                        <v-btn
                           depressed
                           color="primary"
                           large
                           width="100%"
                           @click="() => (dialogRejected = false)"
                        >
                           Dismis
                        </v-btn>
                     </template>

                 </RejectedReasonDialog>

               </v-dialog>

               <DataTable
                  :headers="headers"
                  :items="speciments"
                  :search="search"
                  :loading="isLoading"
                  additional-class="laporan-table"
               >
                  <template v-slot:search-bar>
                     <SearchBar
                        label="Product Name, Status, Lab Name"
                        @input="onSearchInput"
                     ></SearchBar>
                  </template>

                  <template v-slot:item.actions="{ item }">
                     <v-container
                        v-if="item.status == 'Sending' || item.status == 'Paid'"
                     >
                        <v-btn
                          class="btn-sending"
                           small
                           width="200"
                           @click="showDialogInstruction(item)"
                           >Sending Instrunctions</v-btn
                        >
                     </v-container>
                     <v-container v-if="item.status == 'Succes'">
                        <v-btn
                           class="success"
                           small
                           width="200"
                           @click="gotoResult(item)"
                           >View Result</v-btn
                        >
                     </v-container>

                     <v-container v-if="item.status == 'Reject'">
                        <v-btn
                           class="Reject"
                           small
                           width="200"
                           @click="showDialogRejected(item)"
                           >View Reason</v-btn
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
import { mapState } from 'vuex'
import router from '../../../router'
import localStorage from '../../../lib/local-storage'
import DataTable from '../../../components/DataTable'
import SearchBar from '../../../components/DataTable/SearchBar'
import DNASampleSendingInstructions from '../../../components/DNASampleSendingInstructions'
import RejectedReasonDialog from '../../../components/RejectedReasonDialog'

export default {
  name: 'history-test',
  components: {
    DataTable,
    DNASampleSendingInstructions,
    SearchBar,
    RejectedReasonDialog,
  },
  data: () => ({
    headers: [
          { text: 'Lab Name', value: 'labData.name' },
          { text: 'Product Name', value: 'serviceName' },
          { text: 'Speciments Num', value: 'number' },
          { text: 'Status', value: 'status' },
          { text: 'Actions', value: 'actions', sortable: false, align: 'center', width: '5%' },
        ],
    speciments: [],
    selectedSpeciment: {},
    address: '',
    password: '',
    search: '',
    isLoading: false,
    dialogInstruction: false,
    dialogRejected: false,
  }),
  async mounted() {
    this.address = JSON.parse(localStorage.getKeystore())['address'];
  },
  methods: {

    async getSpcimentCount() {
      try {
        const address = this.address;
        const specimenNum = await this.contractDegenics.methods.specimenCount().call({from:address})
        return specimenNum;
      } catch (error) {
        console.log(error)
      }
    },
    async getSpciments(num) {
      try {
        this.isLoading = true;
        let specNum = new Array(parseInt(num)).fill(null);
        const address = this.address;
        const promSpec = specNum.map((x, i)=>this.contractDegenics.methods.specimenByIndex(i+1).call({from: address}))
        const arrSpeciments = await Promise.all(promSpec);
        const Labs = await this.getLabs(arrSpeciments);
        console.log(arrSpeciments, Labs)
        this.speciments = arrSpeciments.map(dt=>{
          let { labAccount, owner, serviceCode, status, number } = dt;
          const labData = Labs.objLab.get(labAccount);
          const objServiceName = Labs.objService.get(labAccount).find(obj=>obj.code == serviceCode);
          const serviceName = objServiceName ? objServiceName.serviceName : "";
          console.log("SN: ", serviceName, serviceCode)
          return { labAccount, owner, serviceCode, status, number, labData, serviceName };
          });

      } catch (error) {
        console.log(error)
      }
      this.isLoading = false;
    },
    async getLabs (arrSpeciments) {
      let objLab = new Map();
      let objService = new Map();
      try {
        for (let speciment of arrSpeciments) {
          let labData = await this.contractDegenics.methods.labByAccount(speciment.labAccount).call();
          let labService = await this.getLabProducts(speciment.labAccount)
          objService.set(speciment.labAccount, labService);
          objLab.set(speciment.labAccount,labData);
        }
        return { objLab, objService };
      } catch (error) {
        console.error(error)
      }
    },
    async getLabProducts(labAccount) {
      try {
        const serviceCount = await this.contractDegenics.methods.serviceCount(labAccount).call()
        let specNum = new Array(parseInt(serviceCount)).fill(null);
        const promService = specNum.map((x, i)=>this.contractDegenics.methods.serviceByIndex(labAccount, i+1).call())
        const services = await Promise.all(promService)
        return  services
      } catch (err) {
        this.products = []
      }
    },
    gotoResult(item) {
      router.push(`/result-test/${item.number}`);
    },
    showDialogInstruction(item) {
      this.dialogInstruction = true;
      this.selectedSpeciment = item;
    },
    showDialogRejected(item) {
      this.dialogRejected = true;
      this.selectedSpeciment = item;
    },
    onSearchInput(val) {
      this.search = val
    },
  },
  computed: {
    ...mapState({
      contractDegenics: state => state.ethereum.contracts.contractDegenics,
    })
  },
  watch: {
    async address(){
      let num = await this.getSpcimentCount();
      await this.getSpciments(num);
    }
  }
}


</script>

<style lang="scss">
@import "../../../styles/variables.scss";

.btn-sending {
   background-color: $color-primary !important;
}

.Sending {
   background-color: $color-primary !important;
}

.Succes {
  background-color: $color-status-success !important;
}

.Reject {
  background-color: $color-status-reject !important;
}

</style>
