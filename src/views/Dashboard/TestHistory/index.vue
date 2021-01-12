
<template>
   <div>
      <v-container>
         <v-row>
            <v-col>
               <v-dialog v-model="dialog" max-width="600px">
                  <template>
                     <v-card>
                        <v-card-title class="headline grey lighten-2">
                           Please Input your password
                        </v-card-title>

                        <v-card-text>
                           <v-text-field
                              class="mt-4"
                              outlined
                              auto-grow
                              type="password"
                              v-model="password"
                              label="Input your password"
                           />
                        </v-card-text>

                        <v-divider></v-divider>

                        <v-card-actions>
                           <v-spacer></v-spacer>
                           <v-btn
                              v-if="address == ''"
                              color="primary"
                              text
                              @click="decryptWallet"
                           >
                              Decrypt Address
                           </v-btn>
                           <v-btn
                              v-if="
                                 address != '' &&
                                 selectedSpeciment.status == 'Paid'
                              "
                              color="primary"
                              text
                              @click="sendSpeciment"
                           >
                              Send Specimen
                           </v-btn>
                        </v-card-actions>
                     </v-card>
                  </template>
               </v-dialog>
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
                        @click="()=>dialogInstruction=false"
                      >
                        Dismis
                      </v-btn>
                    </template>
                  </DNASampleSendingInstructions>
               </v-dialog>

               <DataTable
                  :headers="headers"
                  :items="speciments"
                  :search="search"
                  additional-class="laporan-table"
               >
                  <template v-slot:item.actions="{ item }">
                     <v-container
                        v-if="item.status == 'Sending' || item.status == 'Paid'"
                     >
                        <v-btn color="primary" @click="showDialogInstruction(item)"
                           >Sending Instrunctions</v-btn
                        >
                     </v-container>
                     <v-container
                        v-if="
                           item.status == 'Succes' || item.status == 'Received'
                        "
                     >
                        <v-btn color="secondary" @click="gotoResult(item)"
                           >View Result</v-btn
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
import Wallet from '../../../lib/dgnx-wallet'
import router from '../../../router'
import localStorage from '../../../lib/local-storage'
import DataTable from '../../../components/DataTable'
import DNASampleSendingInstructions from '../../../components/DNASampleSendingInstructions'


export default {
  name: 'history-test',
  components: {
    DataTable,
    DNASampleSendingInstructions,
  },
  data: () => ({
    testNumberInput: '',
    headers: [
          { text: 'Lab Name', value: 'labData.name' },
          { text: 'Product Name', value: 'serviceName' },
          { text: 'Speciments Num', value: 'number' },
          { text: 'Status', value: 'status' },
          { text: 'Actions', value: 'actions', sortable: false },
        ],
    speciments: [],
    dialog: false,
    dialogInstruction: false,
    selectedSpeciment: {},
    address: '',
    password: '',
  }),
  async mounted() {
    await this.decryptWallet()
  },
  methods: {
    async decryptWallet() {
      this.dialog = true;
      if (this.password == '') {
        return;
      }
      const keystore = localStorage.getKeystore()
      const wallet = await Wallet.decrypt(keystore, this.password)
      this.address = wallet.getAddressString();
      this.dialog = false;
    },
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
        let specNum = new Array(parseInt(num)).fill(null);
        const address = this.address;
        const promSpec = specNum.map((x, i)=>this.contractDegenics.methods.specimenByIndex(i+1).call({from: address}))
        const arrSpeciments = await Promise.all(promSpec);
        const Labs = await this.getLabs(arrSpeciments);
        console.log(arrSpeciments, Labs)
        this.speciments = arrSpeciments.map(dt=>{
          let { labAccount, owner, serviceCode, status, number } = dt;
          const labData = Labs.objLab.get(labAccount);
          const serviceName = Labs.objService.get(labAccount).find(obj=>obj.code == serviceCode).serviceName;
          console.log("SN: ", serviceName, serviceCode)
          return { labAccount, owner, serviceCode, status, number, labData, serviceName };
          });
      } catch (error) {
        console.log(error)
      }
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
        const promService = specNum.map((x, i)=>this.contractDegenics.methods.serviceByIndex(labAccount, i).call())
        const services = await Promise.all(promService)
        return  services
      } catch (err) {
        this.products = []
      }
    },
    gotoResult(item) {
      console.log(item)
      router.push(`/result-test/${item.specimentNumber}`);
    },
    showDialog(item) {
        this.dialog = true;
        this.selectedSpeciment = item;
    },
    showDialogInstruction(item) {
      this.dialogInstruction = true;
      this.selectedSpeciment = item;

    }
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
   background-color: $color-primary;
}
</style>
