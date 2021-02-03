<template>
  <div>
    <div class="secondary--text mb-2"><b>Order History</b></div>
    <div v-if="orderHistory.length == 0 && !isLoadingOrderHistory">
      No order history found
    </div>
    <v-progress-linear
      v-if="orderHistory.length == 0 && isLoadingOrderHistory"
      class="mt-2"
      indeterminate
      color="primary"
    ></v-progress-linear>
    <template v-if="orderHistory.length > 0">
      <div
        v-for="(order) in orderHistory"
        :key="order.number"
        class="mb-2"
        @click="gotoDetailOrder(order)"
      >
        <v-tooltip top v-if="order.status == 'Sending'">
          <template v-slot:activator="{ on, attrs }">
            <div v-on="on" v-bind="attrs">
              <OrderCard
                :icon="order.icon"
                :title="order.title"
                :specimenNumber="order.number"
                :labName="order.labName"
                :timestamp="order.timestamp"
                :status="order.status"
              />
            </div>
          </template>
          <span>Click to view sending instructions</span>
        </v-tooltip>
        <template v-else>
          <OrderCard
            :icon="order.icon"
            :title="order.title"
            :specimenNumber="order.number"
            :labName="order.labName"
            :timestamp="order.timestamp"
            :status="order.status"
          />
        </template>
      </div>
      <PrimaryButton @click="goToOrderHistory">Show all order history</PrimaryButton>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import OrderCard from '@/components/OrderCard'
import PrimaryButton from '@/components/PrimaryButton'
import localStorage from '@/lib/local-storage'
import router from '@/router'

export default {
  name: 'OrderHistory',
  components: {
    OrderCard,
    PrimaryButton,
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
    this.getOrderHistory()
  },
  data: () => ({
    orderHistory: [],
    isLoadingOrderHistory: false,
  }),
  methods: {
    async getOrderHistory() {
      this.isLoadingOrderHistory = true
      try {
        const maxOrderHistory = 3
        // Get specimens
        const specimens = await this.getSpecimens(maxOrderHistory)
        // Get labs
        const labAccounts = specimens.map(item => item.labAccount)
            .filter((value, index, self) => self.indexOf(value) === index)
        let labs = await this.getLabs(labAccounts)
        labs = await this.fillLabServices(labs)

        const orders = this.prepareOrderData(specimens, labs)
        this.orderHistory = orders

        this.isLoadingOrderHistory = false
      } catch (err) {

        console.log(err)
        this.isLoadingOrderHistory = false
      }
    },
    async getSpecimens(numSpecimens) {
      try {
        const specimenCount = await this.degenicsContract.methods
          .specimenCount().call({ from: this.userAddress })

        const specimensPromises = []
        for (let i = specimenCount; i > 0; i--) {
          const promise = this.degenicsContract.methods
            .specimenByIndex(i).call({ from: this.userAddress })

          specimensPromises.push(promise)

          if (specimensPromises.length == numSpecimens) {
            break
          }
        }
        const specimens = await Promise.all(specimensPromises)

        return specimens
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
          icon, title, number, labName, timestamp, status, product, lab
        }

        orders.push(order)
      })

      return orders.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp))
    },
    goToOrderHistory() {
      router.push(`/order-history`);
    },
    gotoDetailOrder(order) {
      this.$router.push({ name: 'order-history-detail', params: { number: order.number } })
    }
  },
}
</script>

<style>

</style>
