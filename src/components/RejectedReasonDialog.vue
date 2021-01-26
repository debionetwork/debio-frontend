<template>
  <v-card class="dg-card" elevation="0" outlined>
    <v-card-title class="px-8">
      <div class="text-h6">
        Failed Test
      </div>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col class="pl-6">
          <v-progress-linear
            v-if="isLoading"
            indeterminate
            color="primary"
          ></v-progress-linear>
          <b>{{ rejectionReason }}</b>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="px-8 pb-5">
      <slot name="button">
      </slot>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import keystore from '@/lib/keystore'
import { LOG_REJECTED } from '@/constants/log-type'

export default {
  name: 'RejectedReasonDialog',
  props: {
    specimen: Object,
  },
  computed: {
    ...mapState({
      logContract: state => state.ethereum.contracts.contractDegenicsLog,
    }),
    rejectionReason() {
      return this.logs.length > 0
      ? this.logs.filter(l => l.logType == LOG_REJECTED)[0].log
      : ''
    },
  },
  data: () => ({
    LOG_REJECTED,
    logs: [],
    isLoading: false,
  }),
  mounted() {
    this.getLogs()
  },
  watch: {
    specimen() {
      this.logs = []
      this.getLogs()
    }
  },
  methods: {
    async getLogs() {
      this.isLoading = true

      try {
        const ks = keystore.get()
        const logCount = await this.logContract.methods
          .countSpecimenLog(this.specimen.number).call({ from: ks.address })
        
        const logPromises = []
        for (let i = 1; i <= logCount; i++) {
          const promise = this.logContract.methods
            .specimenLogByIndex(this.specimen.number, i).call()
          logPromises.push(promise)
        }
        const logs = await Promise.all(logPromises)

        this.logs = logs

        this.isLoading = false
      } catch (err) {
        this.logs = [{ log: 'Error getting log' }]
        this.isLoading = false
      }
    },
  }
}
</script>

<style>

</style>
