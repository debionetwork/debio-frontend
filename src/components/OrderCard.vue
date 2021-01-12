<template>
  <CardButton @click="onClick">
    <div class="dg-order-card d-flex align-center fill-height py-2 pr-4" style="width: 100%">
      <div class="my-3 ml-5">
        <v-icon
          v-if="icon"
          color="#BA8DBB"
          :size="48"
        >
          {{ icon }}
        </v-icon>
        <v-avatar v-else>
          <img src="../assets/degenics-logo.webp" />
        </v-avatar>
      </div>
      <div class="ml-5" style="width: 100%;">
        <div class="text-h6">
          <b>{{ title }}</b>
        </div>
        <div class="text-body-2 grey--text text--darken-1">
          {{ specimenNumber | specimenNumber }}
        </div>
        <div class="text-body-1 grey--text text--darken-1 mt-2">
          <b>{{ labName }}</b>
        </div>
        <div class="d-flex align-center justify-space-between fill-height" style="margin-top: -4px;">
          <div class="text-body-2 grey--text text--darken-1">
            {{ timestamp | timestampToDate }}
          </div>
          <div v-if="status">
            <v-chip
              small
              :color="statusColor"
            >
              <div class="text-caption white--text">
                <b>{{ statusText }}</b>
              </div>
            </v-chip>
          </div>
        </div>
      </div>
    </div>
  </CardButton>
</template>

<script>
import CardButton from './CardButton'

export default {
  name: 'OrderCard',
  props: {
    icon: String,
    title: String,
    specimenNumber: String,
    labName: String,
    timestamp: String,
    status: String,
  },
  components: {
    CardButton,
  },
  computed: {
    statusText() {
      return this.status == 'Succes' ? 'Success' : this.status
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
  },
  methods: {
    onClick() {
      
    }
  },
}
</script>

<style lang="scss">
.dg-order-card {
  min-height: 118.85px;
}
</style>
