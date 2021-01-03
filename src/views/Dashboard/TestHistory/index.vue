
<template>
   <div>
      <v-container>
         <v-row>
            <v-col>
               <v-dialog v-model="dialog" max-width="600px" >
                  <template>
                     <v-card>
                        <v-card-title class="headline grey lighten-2">
                           Please insert your password
                        </v-card-title>

                        <v-card-text>
                          <v-text-field v-model="selectedSpeciment.specimentNumber"/>
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
                          <v-btn v-if="address == ''" color="primary" text @click="decryptWallet">
                              Decrypt Address
                           </v-btn>
                           <v-btn v-if="address != '' && selectedSpeciment.status == 'Paid'" color="primary" text @click="sendSpeciment">
                              Send Specimen
                           </v-btn>
                        </v-card-actions>
                     </v-card>
                  </template>
               </v-dialog>

               <v-data-table
                  :headers="headers"
                  :items="speciments"
                  :items-per-page="5"
                  class="elevation-1"
               >
                  <template v-slot:item.actions="{ item }">
                     <v-container v-if="item.status == 'Sending' || item.status == 'Paid'">
                        <v-icon small class="mr-2" @click="showDialog(item)">
                          mdi-check-all
                        </v-icon>
                        <v-icon small class="mr-2" @click="printEnvelope(item)">
                          mdi-email-outline
Google @Google
                        </v-icon>
                     </v-container>
                     <v-container v-if="item.status == 'Succes' || item.status == 'Received'">
                        <v-icon small class="mr-2" @click="gotoResult(item)">
                          mdi-chevron-right-circle
                        </v-icon>
                     </v-container>

                  </template>
               </v-data-table>
            </v-col>
         </v-row>
      </v-container>
   </div>
</template>

<script>
import { mapState } from 'vuex'
import Wallet from 'ethereumjs-wallet'
import router from '../../../router'
import sendTransaction from '../../../lib/send-transaction'
import localStorage from '../../../lib/local-storage'

export default {
  name: 'history-test',
  components: {},
  data: () => ({
    testNumberInput: '',
    headers: [
          {
            text: 'Owner',
            align: 'start',
            sortable: false,
            value: 'owner',
          },
          { text: 'LabAccount', value: 'labAccount' },
          { text: 'ServiceCode', value: 'serviceCode' },
          { text: 'Status', value: 'status' },
          { text: 'Actions', value: 'actions', sortable: false },
        ],
    speciments: [],
    dialog: false,
    selectedSpeciment: {},
    address: '',
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
      const wallet = await Wallet.fromV3(keystore, this.password)
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
        const specimentNumbers =  await this.getSpcimentNumber(arrSpeciments);
        this.speciments = arrSpeciments.map(dt=>{
          let { labAccount, owner, serviceCode, status } = dt;
          const specimentNumber = specimentNumbers.get(owner);
          return { labAccount, owner, serviceCode, status, specimentNumber };
          });
      } catch (error) {
        console.log(error)
      }
    },
    async getSpcimentNumber(arrSpeciments) {
      let objNumbers = new Map();
      try {
        for (let arrSpeciment of arrSpeciments) {
          let promSpec = await this.contractDegenics.methods.getLastNumber().call({from: arrSpeciment.owner});
          objNumbers.set(arrSpeciment.owner,promSpec);
        }
        return objNumbers;
      } catch (error) {
        console.error(error)
      }
    },
    gotoResult(item) {
      console.log(item)
      router.push(`/result-test/${item.specimentNumber}`);
    },
    async acceptSpeciment() {
      try {

        // Retrieve wallet
        console.log('decrypting Keystore...')
        const degenicsContract = this.contractDegenics._address;
        const keystore = localStorage.getKeystore()
        const wallet = await Wallet.fromV3(keystore, this.password)
        const abiData = this.contractDegenics.methods
          .receiveSpecimen(this.selectedSpeciment.specimentNumber, wallet.getPublicKeyString())
          .encodeABI()

        let tx = await sendTransaction(degenicsContract, wallet, abiData)

        console.log(tx, wallet.getAddressString());
        this.dialog = false;
      } catch (err) {
        this.dialog = false;
        console.error(err)
      }
    },
    showDialog(item) {
        this.dialog = true;
        this.selectedSpeciment = item;
    },
    async sendSpeciment() {
      try {

        // Retrieve wallet
        console.log('decrypting Keystore...')
        const degenicsContract = this.contractDegenics._address;
        const keystore = localStorage.getKeystore()
        const wallet = await Wallet.fromV3(keystore, this.password)
        const abiData = this.contractDegenics.methods
          .sendSpecimen(this.selectedSpeciment.specimentNumber, wallet.getPublicKeyString())
          .encodeABI()

        let tx = await sendTransaction(degenicsContract, wallet, abiData)
        console.log(tx, wallet.getAddressString());
        this.dialog = false;
      } catch (err) {
        this.dialog = false;
        console.error(err)
      }
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

<style>
</style>
