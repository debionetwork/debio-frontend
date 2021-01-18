<template>
  <div>
    <div v-if="testResults.length == 0 && !isLoadingTestResults">
      No test results found
    </div>
    <v-progress-linear
      v-if="testResults.length == 0 && isLoadingTestResults"
      class="mt-2"
      indeterminate
      color="primary"
    ></v-progress-linear>
    <template v-if="testResults.length > 0">
      <div
        v-for="(order) in testResults"
        :key="order.number"
        class="mb-2"
         @click="gotoResult(order)"
      >
        <OrderCard
          :icon="order.icon"
          :title="order.title"
          :specimenNumber="order.number"
          :labName="order.labName"
          :timestamp="order.timestamp"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import OrderCard from '../../../components/OrderCard'
import localStorage from '../../../lib/local-storage'
import router from '../../../router'

export default {
  name: 'TestResults',
  components: {
    OrderCard,
  },
  computed: {
    ...mapState({
      degenicsContract: state => state.ethereum.contracts.contractDegenics
    }),
    userAddress() {
      return JSON.parse(localStorage.getKeystore())['address']
    }
  },
  mounted() {
    this.getTestResults()
  },
  data: () => ({
    testResults: [],
    isLoadingTestResults: false,
  }),
  methods: {
    async getTestResults() {
      this.isLoadingTestResults = true
      try {
        const maxResults = 3
        // Get specimens
        const specimens = await this.getSuccessSpecimens(maxResults)
        // Get labs
        const labAccounts = specimens.map(item => item.labAccount)
            .filter((value, index, self) => self.indexOf(value) === index)
        let labs = await this.getLabs(labAccounts)
        labs = await this.fillLabServices(labs)

        const orders = this.prepareOrderData(specimens, labs)
        this.testResults = orders

        this.isLoadingTestResults = false
      } catch (err) {

        console.log(err)
        this.isLoadingTestResults = false
      }
    },
    async getSuccessSpecimens(maxSpecimens) {
      try {
        const specimenCount = await this.degenicsContract.methods
          .specimenCount().call({ from: this.userAddress })

        const specimensPromises = []
        for (let i = specimenCount; i > 0; i--) {
          const promise = this.degenicsContract.methods
            .specimenByIndex(i).call({ from: this.userAddress })

          specimensPromises.push(promise)
        }
        const specimens = await Promise.all(specimensPromises)
        const successSpecimens = specimens.filter(spec => spec.status == 'Succes')

        return successSpecimens.slice(0, maxSpecimens)
      } catch (err) {
        console.log(err)
        throw new Error('Error in getting specimens: ' + err.message)
      }
    },
    async getLabs(labAccounts) {
      try {
        const labPromises = []
        for (let i = 0; i < labAccounts.length; i++) {
          const promise = await this.degenicsContract.methods.labByAccount(labAccounts[i]).call()
          labPromises.push(promise)
        }
        let labs = await Promise.all(labPromises)

        return labs
      } catch (err) {
        console.log(err)
        throw new Error('Error in getting labs: ' + err.message)
      }
    },
    async fillLabServices(labs) {
      try {
        const labWithServicePromises = []
        for (let i = 0; i < labs.length; i++) {
          let lab = labs[i]
          const { labAccount } = lab

          const promise = this.degenicsContract.methods
            .serviceCount(labAccount).call()
              .then(async serviceCount => {
                const getServicePromises = []
                for (let i = 1; i <= serviceCount; i++) {
                  const promise = await this.degenicsContract.methods.serviceByIndex(labAccount, i).call()
                  getServicePromises.push(promise)
                }
                const services = await Promise.all(getServicePromises)
                lab.services = services
                return lab
              })
          labWithServicePromises.push(promise)
        }
        const labWithServices = await Promise.all(labWithServicePromises)

        return labWithServices
      } catch (err) {
        console.log(err)
        throw new Error('Error in getting lab products: ' + err.message)
      }
    },
    /**
    * prepareOrderData
    *
    * @param {Array} specimens
    * @param {Array} labs
    * @returns {Array} productData -- specimen data that includes lab name and product name
    */
    prepareOrderData(specimens, labs) {
      /*
      specimen:
        - date (timestamp) - specimenNumber - status
      lab:
        - labName
      lab product:
        - icon - title
      */
      const orders = []
      specimens.forEach(spec => {
        const { number, timestamp, status, labAccount, serviceCode } = spec
        const lab = labs.filter(l => l.labAccount == labAccount)[0]
        const product = lab.services.filter(serv => serv.code == serviceCode)[0]
        const productAdditionalData = product.additionalData
          ? JSON.parse(product.additionalData)
          : {}

        const icon = productAdditionalData.icon ? productAdditionalData.icon : ''
        const title = product.serviceName
        const labName = lab.name

        const order = {
          icon, title, number, labName, timestamp, status,
        }

        orders.push(order)
      })

      return orders.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp))
    },
    goToTestResults() {
      console.log('TODO: go to order history')
    },
    gotoResult(item) {
      router.push(`/result-test/${item.number}`);
    },
  },
}
</script>

<style>

</style>
