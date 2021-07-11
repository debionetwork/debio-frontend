<template>
  <div>
    <div class="secondary--text mb-2"><b>Order History</b></div>
    <div v-if="preparedOrderHistory.length == 0 && !isLoadingOrderHistory">
      No order history found
    </div>
    <v-progress-linear
      v-if="preparedOrderHistory.length == 0 && isLoadingOrderHistory"
      class="mt-2"
      indeterminate
      color="primary"
    ></v-progress-linear>
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
                :specimenNumber="order.dna_sample_tracking_id"
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
            :specimenNumber="order.dna_sample_tracking_id"
            :labName="order.labName"
            :timestamp="order.timestamp"
            :status="order.status"
          />
        </template>
      </div>
      <PrimaryButton @click="goToOrderHistory"
        >Show all order history</PrimaryButton
      >
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex"
import OrderCard from "@/components/OrderCard"
import PrimaryButton from "@/components/PrimaryButton"
import {
  getOrdersDetailByAddressPagination,
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
        let orders = (await getOrdersDetailByAddressPagination( this.api, address, 1, 3)).orders

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
      const timestamp = (detailOrder.created_at / 1000).toString()
      const status = detailOrder.status
      const dna_sample_tracking_id = detailOrder.dna_sample_tracking_id

      const order = {
        icon,
        title,
        number,
        labName,
        timestamp,
        status,
        dna_sample_tracking_id,
      }

      this.preparedOrderHistory.push(order)
    },
    goToOrderHistory() {
      this.$router.push({
        name: "lab-dashboard-order-history",
      })
    },
    gotoDetailOrder(number) {
      let item = null
      for(let i = 0; i < this.orderHistory.length; i++){
        if(this.orderHistory[i].id == number){
          item = this.orderHistory[i]
        }
      }
      this.$router.push({ 
        name: 'lab-dashboard-process-order', 
        params: { item: item }
      })
    },
  },
}
</script>

<style>
</style>
