<template>
  <div>
    <div class="secondary--text mb-2"><b>Order History</b></div>
    <div v-if="preparedOrderHistory.length == 0 && !isLoadingOrderHistory">
      No Payment History found
    </div>
    <v-progress-linear
      v-if="preparedOrderHistory.length == 0 && isLoadingOrderHistory"
      class="mt-2"
      indeterminate
      color="primary"
    />
    <template v-if="preparedOrderHistory.length > 0">
      <div
        v-for="order in preparedOrderHistory"
        :key="order.number"
        class="mb-2"
        @click="gotoDetailOrder(order.number)"
      >
        <v-tooltip top v-if="order.status == 'Sending'">
          <template v-slot:activator="{ on, attrs }">
            <div v-on="on" v-bind="attrs">
              <OrderCard
                :icon="order.icon"
                :title="order.title"
                :specimenNumber="order.dnaSampleTrackingId"
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
            :specimenNumber="order.dnaSampleTrackingId"
            :labName="order.labName"
            :timestamp="order.timestamp"
            :status="order.status"
          />
        </template>
      </div>
      <PrimaryButton @click="goToOrderHistory">
        Show all Order History
      </PrimaryButton>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex"
import OrderCard from "@/components/OrderCard"
import PrimaryButton from "@/components/PrimaryButton"
import {
  fetchOrderHistory,
} from "@/lib/polkadotProvider/query/orders"

export default {
  name: "LabOrders",
  components: {
    OrderCard,
    PrimaryButton,
  },
  computed: {
    ...mapState({
      walletBalance: (state) => state.substrate.walletBalance,
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
    }),
  },
  mounted() {
    this.getOrderHistory()
  },
  data: () => ({
    orderHistory: [],
    preparedOrderHistory: [],
    isLoadingOrderHistory: false,
  }),
  methods: {
    async getOrderHistory() {
      this.isLoadingOrderHistory = true
      try {
        const address = this.wallet.address
        let {orders} = await fetchOrderHistory(this.api, address)

        for (let i = 0; i < orders.length; i++) {
          this.prepareOrderData(orders[i])
        }
        
        this.isLoadingOrderHistory = false
      } catch (err) {
        this.isLoadingOrderHistory = false
      }
    },

    prepareOrderData(detailOrder) {
      this.orderHistory.push(detailOrder)

      const title = detailOrder.lab_name
      const labName = detailOrder.service_name
      
      let icon = "mdi-needle"
      if (detailOrder.service_image) {
        icon = detailOrder.service_image
      }

      const number = detailOrder.id
      const timestamp = (detailOrder.createdAt / 1000).toString()
      const status = detailOrder.status
      const dnaSampleTrackingId = detailOrder.dnaSampleTrackingId

      const order = {
        icon,
        title,
        number,
        labName,
        timestamp,
        status,
        dnaSampleTrackingId,
      }

      this.preparedOrderHistory.push(order)
    },

    goToOrderHistory() {
      this.$router.push({
        name: "lab-dashboard-order-history",
      })
    },
    
    gotoDetailOrder(id) {
      this.$router.push({ 
        name: 'lab-dashboard-process-order', 
        params: { orderId: id }
      })
    },
  },
}
</script>

<style>
</style>
