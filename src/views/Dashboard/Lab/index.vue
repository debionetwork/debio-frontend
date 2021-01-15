
<template>
   <div>
      <v-container>
         <v-row>
            <!-- <v-col cols="6">
               <v-text-field v-model="testNumberInput" label="Specimen Number">
               </v-text-field>
            </v-col>
            <v-col cols="6">
               <v-btn icon="">Scan</v-btn>
            </v-col> -->
         </v-row>
         <v-row>
            <v-col>
               <v-dialog v-model="dialog" max-width="600px">
                  <template>
                     <v-card>
                        <v-card-title class="headline grey lighten-2">
                           Please input your wallet password
                        </v-card-title>

                        <v-card-text>
                           <v-progress-linear
                              v-if="isLoading"
                              indeterminate
                              color="primary"
                           ></v-progress-linear>
                           <v-text-field
                              class="mt-4"
                              outlined
                              auto-grow
                              type="password"
                              v-model="password"
                              label="Your password"
                           />
                        </v-card-text>

                        <v-divider></v-divider>

                        <v-card-actions>
                           <v-spacer></v-spacer>
                           <v-btn
                              v-if="dialogMode=='accepSpeciment'"
                              color="primary"
                              text
                              @click="acceptSpeciment"
                           >
                              Receive Speciment
                           </v-btn>
                        </v-card-actions>
                     </v-card>
                  </template>
               </v-dialog>

               <DataTable
                  :headers="headers"
                  :items="speciments"
                  :search="search"
                  additional-class="laporan-table"
               >
                  <template v-slot:search-bar>
                     <slot name="dropdown"></slot>
                  </template>

                  <!-- Rows -->
                  <template v-slot:item.actions="{ item }">
                     <v-container
                        v-if="item.status == 'Sending' || item.status == 'Paid'"
                     >
                        <v-btn
                           color="blue lighten-4"
                           small
                           width="100%"
                           @click="showDialog(item, 'accepSpeciment')"
                           >Receive</v-btn
                        >
                        <br />
                        <br />
                        <v-btn color="amber lighten-3" small width="100%"
                           >Reject</v-btn
                        >
                     </v-container>
                     <v-container
                        v-if="
                           item.status == 'Succes'
                        "
                     >
                        <v-btn color="blue-grey lighten-3" width="100%" @click="gotoResult(item)"
                           >View Detail</v-btn
                        >
                     </v-container>

                     <v-container
                        v-if="item.status == 'Received'"
                     >
                        <v-btn color="primary" width="100%" @click="gotoResult(item)">Process</v-btn>
                     </v-container>
                  </template>
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
import sendTransaction from '../../../lib/send-transaction'
import localStorage from '../../../lib/local-storage'
import DataTable from '../../../components/DataTable'


export default {
  name: 'Lab',
  components: {
    DataTable,
  },
  data: () => ({
    testNumberInput: '',
    headers: [
          {
            text: 'Owner',
            align: 'start',
            sortable: false,
            value: 'owner',
          },
          { text: 'Product Name', value: 'serviceName' },
          { text: 'Speciments Num', value: 'number' },
          { text: 'Status', value: 'status' },
          { text: 'Actions', value: 'actions', sortable: false },
        ],
    speciments: [],
    dialog: false,
    dialogMode: "decrypt",
    selectedSpeciment: {},
    address: '',
    products: {},
    isLoading: false,
    search: "",
    password: "",
  }),
  async mounted() {
    this.address = JSON.parse(localStorage.getKeystore())['address'];

    // await this.decryptWallet()
    await this.getLabProducts(this.address)
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
        let specNum = new Array(parseInt(num)).fill(null);
        const address = this.address;
        const promSpec = specNum.map((x, i)=>this.contractDegenics.methods.specimenByIndex(i+1).call({from: address}))
        const arrSpeciments = await Promise.all(promSpec);
        const Labs = await this.getLabs(arrSpeciments);
        console.log(arrSpeciments, Labs)
        this.speciments = arrSpeciments.map(dt=>{
          let { labAccount, owner, serviceCode, status, number } = dt;
          const labData = Labs.objLab.get(labAccount);
          const serviceObj = Labs.objService.get(labAccount).find(obj=>obj.code == serviceCode);
          const serviceName = serviceObj ? serviceObj.serviceName : '';
          return { labAccount, owner, serviceCode, status, number, labName: labData.name, serviceName };
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
      router.push(`/lab/${item.number}`);
    },
    async acceptSpeciment() {
      try {

        // Retrieve wallet
        console.log('decrypting Keystore...')
        const degenicsContract = this.contractDegenics._address;
        const keystore = localStorage.getKeystore()
        const wallet = await Wallet.decrypt(keystore, this.password)
        const abiData = this.contractDegenics.methods
          .receiveSpecimen(this.selectedSpeciment.number, wallet.publicKey)
          .encodeABI()
        let tx = await sendTransaction(degenicsContract, wallet, abiData)
        console.log(tx, wallet);
        await this.loadDatatable();
        this.dialog = false;
      } catch (err) {
        this.dialog = false;
        console.log(err)
      }
    },
    showDialog(item, dialogMode) {
        this.dialog = true;
        this.dialogMode = dialogMode;
        this.selectedSpeciment = item;
    },
    async loadDatatable(){
      let num = await this.getSpcimentCount();
      await this.getSpciments(num);
    }

  },
  computed: {
    ...mapState({
      contractDegenics: state => state.ethereum.contracts.contractDegenics,
    })
  },
  watch: {
    async address(){
      await this.loadDatatable()
    }
  }
}


</script>
