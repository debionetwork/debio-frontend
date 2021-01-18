<template>
    <v-dialog
      :value="show"
      width="500"
      persistent
    >
      <v-card>
        <v-app-bar flat dense color="white">
          <v-toolbar-title class="title">
            Unlock Wallet
          </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-app-bar>
        <v-card-text class="mt-4 pb-0 text-subtitle-1">
          <v-text-field
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            outlined
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            label="Input your password"
            :error="errorMessages.length > 0"
            :error-messages="errorMessages"
            @keyup.enter="decryptWallet"
          >
          </v-text-field>
        </v-card-text>
        <v-card-actions class="px-6 pb-4">
          <v-btn
            depressed
            color="primary"
            large
            width="100%"
            @click="decryptWallet"
            :disabled="!password"
          >
            Unlock Wallet
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  
</template>

<script>
import Wallet from '@/lib/dgnx-wallet'
import keystore from '@/lib/keystore'

export default {
  name: 'UnlockWalletDialog',
  props: {
    show: Boolean,
  },
  data: () => ({
    password: '',
    showPassword: false,
    errorMessages: [],
  }),
  methods: {
    decryptWallet() {
      try {
        this.errorMessages = []
        const ks = keystore.get()
        const wallet = Wallet.decrypt(ks, this.password)

        this.$emit('walletUnlocked', wallet)

      } catch (err) {
        this.errorMessages = [err.message]
      }
    }
  }
}
</script>

<style>

</style>