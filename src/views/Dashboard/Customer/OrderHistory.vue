<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <v-dialog v-model="dialogInstruction" max-width="600px">
            <DNASampleSendingInstructions
              :specimenNumber="selectedSpeciment.dna_sample_tracking_id"
              :lab="selectedSpeciment.detaillab"
              :orderId="selectedSpeciment.number"
              :sourcePage="'order-history'"
              hide-order-history-link
            >
              <template v-slot:button>
                <v-btn
                  depressed
                  color="primary"
                  large
                  width="100%"
                  @click="() => (dialogInstruction = false)"
                >
                  Dismiss
                </v-btn>
              </template>
            </DNASampleSendingInstructions>
          </v-dialog>
          <v-dialog v-model="dialogRejected" max-width="600px">
            <RejectedReasonDialog :specimen="selectedSpeciment">
              <template v-slot:button>
                <v-btn
                  depressed
                  color="primary"
                  large
                  width="100%"
                  @click="() => (dialogRejected = false)"
                >
                  Dismiss
                </v-btn>
              </template>
            </RejectedReasonDialog>
          </v-dialog>

          <DataTable
            :headers="headers"
            :items="orderHistory"
            :search="search"
            :sort-by="['timestamp']"
            :sort-desc="[true]"
            :loading="isLoading"
            additional-class="laporan-table"
          >
            <template v-slot:search-bar>
              <SearchBar
                label="Product Name, Status, Lab Name"
                @input="onSearchInput"
              ></SearchBar>
            </template>
            <template v-slot:[`item.dna_sample_tracking_id`]="{ item }">
              {{ item.dna_sample_tracking_id }}
            </template>
            <template v-slot:[`item.timestamp`]="{ item }">
              {{ item.orderDate }}
            </template>
            <template v-slot:[`item.status`]="{ item }">
              {{ item.status | customerSpecimenStatus }}
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <v-container v-if="item.status == ORDER_PAID">
                <v-btn
                  class="btn-sending"
                  dark
                  small
                  width="200"
                  @click="showDialogInstruction(item)"
                  >View Instructions</v-btn
                >
              </v-container>
              <v-container v-if="item.status == ORDER_PAID || !!isProcessed">
                <v-btn
                  class="Received"
                  dark
                  small
                  width="200"
                  @click="goToOrderDetail(item)"
                  >View Order</v-btn
                >
              </v-container>
              <v-container v-if="item.status == ORDER_UNPAID && !isProcessed">
                <v-btn
                  class="btn-sending"
                  dark
                  small
                  width="200"
                  @click="goToOrderDetail(item)"
                  >Pay</v-btn
                >
              </v-container>
              <v-container v-if="item.status == ORDER_FULFILLED">
                <v-btn
                  class="success"
                  small
                  width="200"
                  @click="goToOrderDetail(item)"
                  >View Order</v-btn
                >
              </v-container>

              <v-container v-if="item.status == REJECTED">
                <v-btn
                  class="Reject"
                  dark
                  small
                  width="200"
                  @click="showDialogRejected(item)"
                  >View Reason</v-btn
                >
              </v-container>

              <v-container v-if="item.status == ORDER_FAILED">
                <v-btn
                  class="success"
                  dark
                  small
                  width="200"
                  @click="goToOrderDetail(item)"
                  >View Order</v-btn
                >
              </v-container>

              <v-container v-if="item.status == ORDER_CANCEL">
                <v-btn
                  class="success"
                  dark
                  small
                  width="200"
                  @click="goToOrderDetail(item)"
                  >View Order</v-btn
                >
              </v-container>
              <v-container v-if="item.status == ORDER_REFUNDED">
                <v-btn
                  class="Reject"
                  dark
                  small
                  width="200"
                  @click="goToOrderDetail(item)"
                  >View Order</v-btn
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
import { mapState } from "vuex";
import DataTable from "@/components/DataTable";
import SearchBar from "@/components/DataTable/SearchBar";
import DNASampleSendingInstructions from "@/components/DNASampleSendingInstructions";
import RejectedReasonDialog from "@/components/RejectedReasonDialog";
import {
  SENDING,
  RECEIVED,
  SUCCESS,
  REJECTED,
  ORDER_UNPAID,
  ORDER_PAID,
  ORDER_FULFILLED,
  ORDER_REFUNDED,
  ORDER_FAILED,
  ORDER_CANCEL
} from "@/constants/specimen-status";
import {
  ordersByCustomer,
  getOrdersData,
} from "@/lib/polkadotProvider/query/orders";
import { queryLabsById } from "@/lib/polkadotProvider/query/labs";
import { queryServicesById } from "@/lib/polkadotProvider/query/services";
import localStorage from "@/lib/local-storage"

export default {
  name: "history-test",
  components: {
    DataTable,
    DNASampleSendingInstructions,
    SearchBar,
    RejectedReasonDialog,
  },

  data: () => ({
    SENDING,
    RECEIVED,
    SUCCESS,
    REJECTED,
    ORDER_UNPAID,
    ORDER_PAID,
    ORDER_FULFILLED,
    ORDER_REFUNDED,
    ORDER_FAILED,
    ORDER_CANCEL,
    headers: [
      { text: "Lab Name", value: "labName" },
      { text: "Product Name", value: "title" },
      { text: "Specimen Number", value: "dna_sample_tracking_id" },
      { text: "Date", value: "timestamp" },
      { text: "Status", value: "status" },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        align: "center",
        width: "5%",
      },
    ],
    speciments: [],
    selectedSpeciment: {},
    address: "",
    password: "",
    search: "",
    isLoading: false,
    dialogInstruction: false,
    dialogRejected: false,
    orderHistory: [],
    isProcessed: null
  }),

  computed: {
    ...mapState({
      walletBalance: (state) => state.substrate.walletBalance,
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      lastEventData: (state) => state.substrate.lastEventData,
    }),
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

    async address() {
      await this.getOrderHistory();
    }
  },

  async mounted() {
    this.address = this.wallet.address;
  },

  methods: {
    checkLastOrder() {
      const status = localStorage.getLocalStorageByName("lastOrderStatus")

      this.isProcessed = status ? status : null
    },

    async getOrderHistory() {
      this.checkLastOrder()
      this.isLoading = true;
      try {
        this.orderHistory = [];
        const listOrderId = await ordersByCustomer(this.api, this.address);

        var lengthMax = 3;
        if (listOrderId != null) {
          listOrderId.reverse();
          lengthMax = listOrderId.length;

          for (let i = 0; i < lengthMax; i++) {
            const detailOrder = await getOrdersData(this.api, listOrderId[i]);
            if (detailOrder != null) {
              const detaillab = await queryLabsById(
                this.api,
                detailOrder.seller_id
              );
              if (detaillab != null) {
                const detailService = await queryServicesById(
                  this.api,
                  detailOrder.service_id
                );
                if (detailService != null) {
                  this.prepareOrderData(detailOrder, detaillab, detailService);
                }
              }
            }
          }

          if (this.orderHistory.length > 0) {
            this.orderHistory.sort(
              (a, b) => parseInt(b.timestamp) - parseInt(a.timestamp)
            );
          }
        }

        this.isLoading = false;
      } catch (err) {
        console.log(err);
        this.isLoading = false;
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
        detaillab,
        orderDate,
      };

      this.orderHistory.push(order);
      if (this.isProcessed) this.orderHistory[0].status = this.isProcessed
    },

    goToOrderDetail(item) {
      this.$router.push({
        name: "order-history-detail",
        params: { number: item.number },
      });
    },

    gotoResult(item) {
      this.$router.push({
        name: "result-test",
        params: { number: item.dna_sample_tracking_id },
      });
    },

    showDialogInstruction(item) {
      this.selectedSpeciment = item;
      this.dialogInstruction = true;
    },

    showDialogRejected(item) {
      this.dialogRejected = true;
      this.selectedSpeciment = item;
    },

    onSearchInput(val) {
      this.search = val;
    }
  },
};
</script>

<style lang="scss">
@import "@/styles/variables.scss";

.btn-sending {
  background-color: $color-primary !important;
}

.Sending {
  background-color: $color-primary !important;
}

.Received {
  background-color: $color-status-received !important;
}

.Succes {
  background-color: $color-status-success !important;
}

.Reject {
  background-color: $color-status-reject !important;
}
</style>
