<template>
  <div>
    <v-card class="dg-card" elevation="0" outlined>
      <v-card-title class="text-h6 px-8">
        Refund Policy
      </v-card-title>
      <v-card-text class="px-8">
          <div>
            Your order has been received at <b>{{ receivedDateTime }}</b>
          </div>
          <div>
            You will be eligible for a refund if your order is not processed by
          </div>
          <div>
            <b>{{ sevenDaysFromReceived }}</b>
          </div>
      </v-card-text>
      <v-card-actions class="px-8 pb-5">
        <v-btn
          depressed
          large
          color="blue"
          width="100%"
          @click="refundDialog = true"
          style="color: white;"
          :disabled="!hasPassedSevenDaysSinceReceived"
        >
          Refund
        </v-btn>
      </v-card-actions>
    </v-card>
    <Dialog :show="refundDialog">
      <template v-slot:title>
        Refund Confirmation
      </template>
      <template v-slot:body>
        <div style="word-wrap: break-word;">
          Are you sure you wanto to refund order number <b>{{ specimen.number }}</b>?
        </div>
        <div v-if="errorMessage" style="color: red;">
          {{ errorMessage }}
        </div>
        <v-progress-linear
            v-if="isLoadingRefund"
            indeterminate
            color="primary"
        ></v-progress-linear>
      </template>
      <template v-slot:actions>
        <div class="d-flex justify-space-between" style="width: 100%;">
          <div class="pr-1" style="flex: 1">
            <Button @click="refundDialog = false" color="grey" dark>
              Cancel
            </Button>
          </div>
          <div class="pr-1" style="flex: 1">
            <Button @click="unlockWalletDialog = true" color="blue" dark>
              Refund
            </Button>
          </div>
        </div>
      </template>
    </Dialog>
    <UnlockWalletDialog
      :show="unlockWalletDialog"
      @cancel="unlockWalletDialog = false"
      @unlocked="refund"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { format, fromUnixTime, addDays, isPast } from 'date-fns'
import UnlockWalletDialog from '@/components/UnlockWalletDialog'
import Dialog from '@/components/Dialog'
import Button from '@/components/Button'
import sendTransaction from '@/lib/send-transaction'

export default {
  name: 'Refund',
  components: {
    Dialog,
    Button,
    UnlockWalletDialog
  },
  props: {
    specimen: Object,
    receivedLog: Object,
  },
  data: () => ({
    receivedTimestamp: '',
    refundDialog: false,
    unlockWalletDialog: false,
    isLoadingRefund: false,
    errorMessage: '',
  }),
  computed: {
    ...mapState({
      degenicsContract: state => state.ethereum.contracts.contractDegenics,
      degenicsLogContract: state => state.ethereum.contracts.contractDegenicsLog
    }),
    receivedDateTime() {
      const timestamp = this.receivedLog.time
      return format(fromUnixTime(timestamp), 'MMMM dd yyyy hh:mm')
    },
    sevenDaysFromReceived() {
      const timestamp = this.receivedLog.time
      const receivedDate = fromUnixTime(timestamp)
      const sevenDaysLater = addDays(receivedDate, 7)
      return format(sevenDaysLater, 'MMMM dd yyyy hh:mm')
    },
    hasPassedSevenDaysSinceReceived() {
      const timestamp = this.receivedLog.time
      const receivedDate = fromUnixTime(timestamp)
      const sevenDaysLater = addDays(receivedDate, 7)
      return isPast(sevenDaysLater)
    }
  },
  methods: {
    async refund(wallet) {
      this.unlockWalletDialog = false
      this.isLoadingRefund = true
      this.errorMessage = ''
      console.log(wallet)

      try {
        const data = this.degenicsContract.methods
          .refund(this.specimen.number).encodeABI()
        const res = await sendTransaction(this.degenicsContract._address, wallet, data)
        console.log(res)

        this.$emit('refunded')

      } catch (err) {
        // TODO: Parse revert reason for human readable error message
        console.log(err)
        this.errorMessage = err.message
        this.isLoadingRefund = false
      }
    },
  }
}
</script>

<style>

</style>