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
                :timestamp="order.timestamp"
                :status="order.status"
                :orderDate="order.orderDate"
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
            :orderDate="order.orderDate"
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
  ordersByCustomer,
  getOrdersData,
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
      lastEventData: (state) => state.substrate.lastEventData,
    }),
    userAddress() {
      return JSON.parse(localStorage.getKeystore())["address"];
    },
  },
  watch: {
    lastEventData() {
      if (this.lastEventData != null) {
        const dataEvent = JSON.parse(this.lastEventData.data.toString());
        if (this.lastEventData.section == "orders") {
          if (dataEvent[0].customer_id == this.wallet.address) {
            this.getOrderHistory();
          }
        }
      }
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
        const listOrderId = await ordersByCustomer(this.api, address);

        var lengthMax = 3;
        if (listOrderId != null) {
          listOrderId.reverse();
          if (listOrderId.length < lengthMax) {
            lengthMax = listOrderId.length;
          }

          for (let i = 0; i < lengthMax; i++) {
            const detailOrder = await getOrdersData(this.api, listOrderId[i]);
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
          const status = localStorage.getLocalStorageByName("lastOrderStatus")
          if (status) this.orderHistory[0].status = status
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
      const dateSet = new Date(
        parseInt(detailOrder.created_at.replace(/,/g, ""))
      );
      const timestamp = dateSet.getTime().toString();
      const orderDate = dateSet.toLocaleString("en-US", {
        weekday: "short", // long, short, narrow
        day: "numeric", // numeric, 2-digit
        year: "numeric", // numeric, 2-digit
        month: "long", // numeric, 2-digit, long, short, narrow
        hour: "numeric", // numeric, 2-digit
        minute: "numeric",
      });
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
        orderDate,
      };

      this.orderHistory.push(order);
    },
    goToOrderHistory() {
      this.$router.push({
        name: "order-history",
      });
    },
    gotoDetailOrder(order) {
      this.$router.push({
        name: "order-history-detail",
        params: { number: order.number },
      });
    },
  },
};
</script>

<style>
</style>
