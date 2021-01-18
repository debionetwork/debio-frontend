<template>
   <div>
    <v-container>
      <v-row class="my-2">
        <v-col cols="12">
          <div class="text-h5 px-2 secondary--text text--lighten-2">
            <b>Orders</b>
          </div>
        </v-col>
      </v-row>
        <v-row>
          <v-col>
            <DataTable
              :headers="headers"
              :items="speciments"
              :search="search"
              :sort-by="['timestamp']"
              :sort-desc="[true]"
              additional-class="laporan-table"
              :loading="isLoading"
            >
              <template v-slot:search-bar>
                <SearchBar
                  label="Search"
                  @input="onSearchInput"
                ></SearchBar>
              </template>

              <!-- Rows -->
              <template v-slot:[`item.number`]="{ item }">
                {{ item.number | specimenNumber }}
              </template>
              <template v-slot:[`item.timestamp`]="{ item }">
                {{ item.timestamp | timestampToDate }}
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <div class="py-4">
                  <div v-if="item.status == 'Succes'">
                    <router-link :to="`/lab/${item.number}`">
                      <b>View</b>
                    </router-link>
                  </div>
                  <div
                    v-else
                    v-for="(action, idx) in nextActionsAvailable(item.status, item.number)"
                    :key="idx + item.number"
                  >
                    <router-link
                      v-if="isNextAction(action, item.status)"
                      :to="`/lab/${item.number}`"
                    >
                      <b>{{ action.name }}</b>
                    </router-link>
                    <div class="grey--text text--darken-1" v-else>
                      {{ action.name }}
                    </div>
                  </div>
                </div>
              </template>
            </DataTable>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import v from 'voca'
import router from '../../../router'
import localStorage from '../../../lib/local-storage'
import DataTable from '../../../components/DataTable'
import SearchBar from '../../../components/DataTable/SearchBar'
import specimenFilesTempStore from '../../../lib/specimen-files-temp-store'

export default {
  name: 'Lab',
  components: {
    DataTable,
    SearchBar,
  },
  data: () => ({
    testNumberInput: '',
    headers: [
      {
        text: 'Customer Account',
        align: 'start',
        sortable: false,
        value: 'owner',
      },
      { text: 'Product Name', value: 'serviceName' },
      { text: 'Specimen Number', value: 'number' },
      { text: 'Date', value: 'timestamp' },
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
    nextActions: [
      'Receive', 'Wetwork', 'Genome', 'Report', 'Send'
    ],
  }),
  computed: {
    ...mapState({
      contractDegenics: state => state.ethereum.contracts.contractDegenics,
    }),
  },
  watch: {
    async address(){
      await this.loadDatatable()
    }
  },
  async mounted() {
    this.address = JSON.parse(localStorage.getKeystore())['address'];
    // await this.decryptWallet()
    await this.getLabProducts(this.address)
  },
  methods: {
    onSearchInput(val) {
      this.search = val
    },
    /**
     * nextActionsAvailable
     *
     * Determine the next actions available for the specimen
     *
     * nextActionConditions:
     *   'Sending'  => 'Receive'
     *   'Received' => 'Wetwork'
     *   'Wetwork'  => 'Genome'
     *   'Genome'   => 'Report'
     *   'Report'   => 'Send'
     *   'Reject'   => 'View'
     *   'Succes'   => 'View'
     *
     *  FIXME: Consider saving actions that are done in local storage.
     *      for simpler logic of determining next actions
     */
    nextActionsAvailable(specimenStatus, specimenNumber) {
      if (specimenStatus == 'Sending') {
        return this.nextActions.map(action => ({ name: action, doneFileTypes: [] }))
      }
      if (specimenStatus == 'Reject') {
        return [{ name: 'View', doneFileTypes: [] }]
      }
      // The specimenStatus on blockchain should now be 'Received'
      // need to manage next actions based on what has been done locally
      const files = specimenFilesTempStore.get(specimenNumber)
      if (!files) { // no files, nextActions start from Wetwork
        return this.nextActions.slice(1).map(action => ({ name: action, doneFileTypes: [] }))
      }
      const doneFileTypes = []
      for (const [fileType, files] of Object.entries(files)) {
        if (files.length > 0) {
          doneFileTypes.push(v.titleCase(fileType))
        }
      }
      // We have files, remove 'Wetwork' from nextActions
      let nextActions = this.nextActions.slice(2)
      // Remove 'Genome' and/or 'Report' if in doneFileTypes
      doneFileTypes.forEach(fileType => {
        nextActions = nextActions.filter(action => action != fileType)
      })
      // Return doneFileTypes because needed to determine next action based on doneFile Types
      return nextActions.map(action => ({ name: action, doneFileTypes }))
    },
    /**
     * isNextAction
     *
     * Determine if processAction (Receive / Wetwork / Genome / Report / Send) is the next action
     * Based on specimen status
     *
     * nextActionConditions:
     *   'Sending'  => 'Receive'
     *   'Received' => 'Wetwork'
     *   'Wetwork'  => 'Genome'
     *   'Genome'   => 'Report'
     *   'Report'   => 'Send'
     *   'Reject'   => 'View'
     *   'Succes'   => 'View'
     *
     * @param {string} status
     * @return {boolean}
     */
    isNextAction(action, status) {
      if (status == 'Succes' || status == 'Reject') {
        return action.name == 'View'
      }
      if (status == 'Sending') {
        return action.name == 'Receive'
      }
      if (status == 'Received') {
        if (action.doneFileTypes.length == 0) {
          return action.name == 'Wetwork'
        }
        // Is next action if not yet in doneFileTypes (Genome, Report)
        return !action.doneFileTypes.includes(action.name)
      }
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
          let { labAccount, owner, serviceCode, status, number, timestamp } = dt;
          const labData = Labs.objLab.get(labAccount);
          const serviceObj = Labs.objService.get(labAccount).find(obj=>obj.code == serviceCode);
          const serviceName = serviceObj ? serviceObj.serviceName : '';
          return { labAccount, owner, serviceCode, status, number, labName: labData.name, serviceName, timestamp };
          })
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
          console.log(objLab)
          console.log('objService', objService)
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
      router.push(`/lab/${item.number}`);
    },
    async loadDatatable(){
      this.isLoading = true

      let num = await this.getSpcimentCount();
      await this.getSpciments(num);

      this.isLoading = false
    },
  },
}


</script>
