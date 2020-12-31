<template>
  <v-dialog
    :value="_show"
    width="500"
    persistent
  >
    <v-card>
      <v-app-bar flat dense color="white">
        <v-toolbar-title class="title">
          Send Payment
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="closeDialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <v-card-text class="mt-4 pb-0 text-subtitle-1">
        <!-- Lab Recipient Details -->
        <div>
          <div class="text-h5">
            Payment Recipient
          </div>
          <div class="text-body-1 mt-4">
            <b>{{ lab.name }}</b>
          </div>
          <div v-if="lab.labAddress" class="text-body-2">
            {{ lab.labAddress }}
          </div>
          <div class="text-body-2">
            {{ lab.city }}, {{ lab.country }}
          </div>
          <div class="text-body-1 mt-2">
            Escrow Address
          </div>
          <div class="text-body-2">
            TODO: Escrow Address
          </div>
        </div>

        <!-- Payment Details -->
        <div class="mt-6">
          <div class="text-h5">
            Payment Details
          </div>
          <div class="d-flex align-center justify-space-between mt-4">
            <div class="text-body-1">
              <b>Total Price</b>
            </div>
            <div>
              <span class="text-h6">
                {{ totalPrice }}
              </span>
              <span class="primary--text text-caption">
                DGNX
              </span>
            </div>
          </div>
          <div class="d-flex align-center justify-space-between">
            <div class="text-body-1">
              <b>Transaction Fee</b>
            </div>
            <div>
              <span class="text-h6">
                {{ transactionFee }}
              </span>
              <span class="text-caption">
                Gwei
              </span>
            </div>
          </div>
        </div>

        <!-- Prompt password to sign transaction -->
        <v-text-field
          class="mt-4"
          outlined
          auto-grow
          type="password"
          v-model="password"
          label="Input your password"
          :disabled="isLoading"
        >
        </v-text-field>
        <v-progress-linear
          v-if="isLoading"
          indeterminate
          color="primary"
        ></v-progress-linear>
      </v-card-text>
      <v-card-actions class="px-6 pb-4">
        <v-btn
          depressed
          color="primary"
          large
          width="100%"
          @click="onSubmit"
          :disabled="!password || isLoading"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Wallet from 'ethereumjs-wallet'
import { mapGetters } from 'vuex'

export default {
  name: 'SendPaymentDialog',
  props: {
    show: Boolean,
    lab: Object,
    totalPrice: [String, Number]
  },
  data: () => ({
    password: '',
    isLoading: false,
    transactionFee: 'TODO',
  }),
  computed: {
    _show: {
      get() {
        return this.show
      },
      set(val) {
        this.$emit('toggle', val)
      }
    },
    ...mapGetters({
      keystore: 'ethereum/getKeystore'
    }),
  },
  methods: {
    async onSubmit() {
      this.isLoading = true

      const wallet = await Wallet.fromV3(this.keystore, this.password)
      const privateKey = wallet.getPrivateKeyString() 

      console.log(privateKey)
      // TODO: Send payment here

      this.isLoading = false

      this._show = false
      this.$emit('payment-sent')
      this.password = ''
    },
    closeDialog() {
      this._show = false
      this.password = ''
    }
  }
}
</script>

<style>

</style>



