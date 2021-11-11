<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <v-dialog v-model="dialogInstruction" max-width="600px">
            <DNASampleSendingInstructions
              :specimenNumber="selectedSpeciment.dnaSampleTrackingId"
              :lab="selectedSpeciment.LabInfo"
              :orderId="selectedSpeciment.id"
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
            <template v-slot:[`item.dnaSampleTrackingId`]="{ item }">
              {{ item.dnaSampleTrackingId }}
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
  searchOrder,
} from "@/lib/polkadotProvider/query/orders";
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
      { text: "Lab Name", value: "LabInfo.name" },
      { text: "Product Name", value: "service_info.name" },
      { text: "Specimen Number", value: "dnaSampleTrackingId" },
      { text: "Date", value: "createdAt" },
      { text: "Status", value: "status" },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        align: "center",
        width: "5%",
      },
    ],
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
          if (dataEvent[0].customerId == this.wallet.address) {
            this.onSearchInput()
          }
        }
      }
    },

    async address() {
      await this.onSearchInput()
    }
  },

  async mounted() {
    this.address = this.wallet.address;
    await this.onSearchInput()
  },

  methods: {
    checkLastOrder() {
      const status = localStorage.getLocalStorageByName("lastOrderStatus")

      this.isProcessed = status ? status : null
    },

    goToOrderDetail(item) {
      this.$router.push({
        name: "order-history-detail",
        params: { number: item.id },
      });
    },

    gotoResult(item) {
      this.$router.push({
        name: "result-test",
        params: { number: item.dnaSampleTrackingId },
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

    async onSearchInput(val) {
      this.checkLastOrder()

      const results = await searchOrder(val)
      this.orderHistory = results.map(result => ({
        ...result._source,
        createdAt: new Date(parseInt(result._source.createdAt)).toLocaleDateString(),
        timestamp: parseInt(result._source.createdAt)
      }))
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
