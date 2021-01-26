<template>
  <div>
    <v-alert
      type="success"
      rounded="true"
      class="rounded-lg"
      color="yellow"
      icon="mdi-cancel"
    >
      <b>Specimen Rejected</b>
    </v-alert>
    <v-card class="dg-card">
      <v-card-title class="px-8">
        <div class="text-h6">
          Rejection Reason
        </div>
      </v-card-title>
      <v-card-text class="px-8">
        {{ rejectionReason }}
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import keystore from '@/lib/keystore'
import { LOG_REJECTED } from '@/constants/log-type'

export default {
  name: 'RejectAlert',
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
  }),
  mounted() {
    this.getLogs() 
  },
  methods: {
    async getLogs() {
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
    },
  }
}
</script>

<style>

</style>
