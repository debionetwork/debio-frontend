<template>
  <v-chip small :color="statusColor">
    <div class="text-caption white--text">
      <b>{{ statusText }}</b>
    </div>
  </v-chip>
</template>

<script>
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

      switch(this.status) {
        case 'Sending':
          return grey
        case 'Received':
          return blue
        case 'Reject':
          return yellow
        case 'Succes':
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