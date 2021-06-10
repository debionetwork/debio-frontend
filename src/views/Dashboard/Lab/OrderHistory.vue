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
        v-for="order in orderHistory"
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
                :specimenNumber="order.dna_sample_tracking_id"
                :labName="order.labName"
                :timestamp="order.dateOrder"
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
import { mapState } from "vuex";
import OrderCard from "@/components/OrderCard";
import PrimaryButton from "@/components/PrimaryButton";
import localStorage from "@/lib/local-storage";
import {
  getOrdersDetailByAddress,
  getOrdersDetail,
} from "@/lib/polkadotProvider/query/orders";
import { queryLabsById } from "@/lib/polkadotProvider/query/labs";
import { queryServicesById } from "@/lib/polkadotProvider/query/services";

export default {
  name: "OrderHistory",
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
    userAddress() {
      return JSON.parse(localStorage.getKeystore())["address"];
    },
  },
  mounted() {
    this.getOrderHistory();
  },
  data: () => ({
    orderHistory: [],
    isLoadingOrderHistory: false,
  }),
  methods: {
    async getOrderHistory() {
      this.isLoadingOrderHistory = true;
      try {
        this.orderHistory = [];
        const address = this.wallet.address;
        const listOrderId = await getOrdersDetailByAddress(
          this.api,
          address,
        );

        var lengthMax = 3;
        if (listOrderId != null) {
          listOrderId.reverse();
          if (listOrderId.length < lengthMax) {
            lengthMax = listOrderId.length;
          }

          for (let i = 0; i < lengthMax; i++) {
            const detailOrder = await getOrdersDetail(this.api, listOrderId[i]);
            const detaillab = await queryLabsById(
              this.api,
              detailOrder.seller_id
            );
            const detailService = await queryServicesById(
              this.api,
              detailOrder.service_id
            );
            this.prepareOrderData(detailOrder, detaillab, detailService);
          }

          this.orderHistory.sort(
            (a, b) => parseInt(b.timestamp) - parseInt(a.timestamp)
          );
        }

        this.isLoadingOrderHistory = false;
      } catch (err) {
        console.log(err);
        this.isLoadingOrderHistory = false;
      }
    },
    prepareOrderData(detailOrder, detaillab, detailService) {
      const title = detailService.info.name;
      const labName = detaillab.info.name;
      let icon = "mdi-needle";
      if (detailService.info.image != null) {
        icon = detailService.info.image;
      }

      const number = detailOrder.id;
      const timestamp = (detailOrder.created_at.replace(/,/g, "") / 1000).toString();
      const status = detailOrder.status;
      const dna_sample_tracking_id = detailOrder.dna_sample_tracking_id;

      const order = {
        icon,
        title,
        number,
        labName,
        timestamp,
        status,
        dna_sample_tracking_id,
      };

      this.orderHistory.push(order);
    },
    goToOrderHistory() {
      this.$router.push({
        name: "lab-dashboard-order-history",
      });
    },
    gotoDetailOrder(item) {
      this.$router.push({ 
        name: 'lab-dashboard-process-order', 
        params: { item: item }
      })
    },
  },
};
</script>

<style>
</style>
