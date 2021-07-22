<template>
  <v-chip small :color="statusColor">
    <div class="text-caption white--text">
      <b>{{ statusText }}</b>
    </div>
  </v-chip>
</template>

<script>
import {
  SENDING,
  ARRIVED,
  REJECTED,
  SUCCESS,
  FAILED,
} from "@/constants/specimen-status";
import { ORDER_CANCEL, ORDER_REFUNDED } from "@/constants/order-status";

export default {
  name: "StatusChip",
  props: {
    status: String,
  },
  computed: {
    statusText() {
      return this.status;
    },
    statusColor() {
      const grey = "#a7919c";
      const blue = "#63d0d5";
      const green = "#6edaa8";
      const yellow = "#EFC457";
      const black = "#272727";
      const red = "#FF2525";

      switch (this.status) {
        case SENDING:
          return black;
        case ARRIVED:
          return blue;
        case REJECTED:
          return red;
        case ORDER_REFUNDED:
          return yellow;
        case SUCCESS:
          return green;
        case ORDER_CANCEL:
          return red;
        case FAILED:
          return red;
        default:
          return grey;
      }
    },
  },
};
</script>

<style>
</style>