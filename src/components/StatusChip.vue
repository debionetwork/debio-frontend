<template>
  <v-chip small :color="statusColor">
    <div class="text-caption white--text">
      <b>{{ statusText }}</b>
    </div>
  </v-chip>
</template>

<script>
import { SENDING, SUCCESS, RECEIVED, REJECTED, ORDER_REFUNDED, ORDER_FAILED, ORDER_PROCESSED } from '@/constants/specimen-status'

export default {
  name: 'StatusChip',
  props: {
    status: String,
  },
  computed: {
    statusText() {
      return this.status
    },
    statusColor() {
      const grey = '#a7919c'
      const blue = '#63d0d5'
      const green = '#6edaa8'
      const yellow = '#EFC457'
      const black = '#272727'
      const red = '#FF2525'

      switch(this.status) {
        case SENDING:
          return grey
        case RECEIVED:
          return blue
        case REJECTED:
          return yellow
        case ORDER_REFUNDED:
          return black
        case SUCCESS:
          return green
        case ORDER_FAILED:
          return red
        case ORDER_PROCESSED:
          return green
        default:
          return grey
      }
    }
  }
}
</script>

<style>

</style>