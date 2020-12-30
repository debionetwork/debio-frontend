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
          <div class="text-body-2">
            {{ lab.city }}, {{ lab.country }}
          </div>
          <div class="text-body-1 mt-2">
            Wallet Address
          </div>
          <div class="text-body-2">
            {{ lab.walletAddress }}
          </div>
        </div>

        <!-- Payment Details -->
        <div class="mt-6">
          <div class="text-h5">
            Payment Details
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
        >
        </v-text-field>
      </v-card-text>
      <v-card-actions class="px-6 pb-4">
        <v-btn
          depressed
          color="primary"
          large
          width="100%"
          @click="onSubmit"
          :disabled="!password"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SendPaymentDialog',
  props: {
    show: Boolean
  },
  data: () => ({
    password: '',
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
    ...mapState({
      lab: state => state.cart.lab
    }),
  },
  methods: {
    onSubmit() {
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



