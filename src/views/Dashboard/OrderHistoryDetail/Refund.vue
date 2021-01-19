<template>
  <div>
    <v-card class="dg-card" elevation="0" outlined>
      <v-card-title class="text-h6 px-8">
        Refund Policy
      </v-card-title>
      <v-card-text class="px-8">
          <div>
            Your order has been received at (TODO: Received datetime)
          </div>
          <div>
            You will eligible for a refund if your order is not processed by
          </div>
          <div>
            TODO: 7 Days from received datetime
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
          Are you sure you wanto to refund order number <b>{{ specimen.number | specimenNumber }}</b>?
        </div>
      </template>
      <template v-slot:actions>
        <div class="d-flex justify-space-between" style="width: 100%;">
          <div class="pr-1" style="flex: 1">
            <Button @click="refundDialog = false" color="grey" dark>
              Cancel
            </Button>
          </div>
          <div class="pr-1" style="flex: 1">
            <Button @click="refund" color="blue" dark>
              Refund
            </Button>
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Dialog from '../../../components/Dialog'
import Button from '../../../components/Button'

export default {
  name: 'Refund',
  components: {
    Dialog,
    Button,
  },
  props: {
    specimen: Object,
  },
  data: () => ({
    receivedTimestamp: '',
    refundDialog: false,
  }),
  computed: {
    ...mapState({
      degenicsLogContract: state => state.ethereum.contracts.contractDegenicsLog
    })
  },
  async mounted() {
    await this.getSpecimenReceivedTimestamp()
  },
  methods: {
    async getSpecimenReceivedTimestamp() {
      //TODO:
      return 'TODO: Get received date time from smart contract'
    },
  }
}
</script>

<style>

</style>