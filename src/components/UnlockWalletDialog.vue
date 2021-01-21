<template>
  <Dialog :show="show">
    <template v-slot:title>
      Unlock Wallet
    </template>
    <template v-slot:body>
      <v-text-field
        :append-icon="showPassword? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword = !showPassword"
        outlined
        :type="showPassword ? 'text' : 'password'"
        v-model="password"
        label="Type in your password"
        :disabled="isLoading"
        :error-messages="errorMessages"
        @keyup.enter="onPasswordInput"
      >
      </v-text-field>
      <v-progress-linear
        v-if="isLoading"
        indeterminate
        color="primary"
      ></v-progress-linear>
    </template>
    <template v-slot:actions>
      <div v-if="cancellable" class="d-flex justify-space-between" style="width: 100%;">
        <div class="pr-1" style="flex: 1">
          <Button @click="onCancel" color="grey" dark>
            Cancel
          </Button>
        </div>
        <div class="pr-1" style="flex: 1">
          <Button @click="decryptWallet" color="primary" dark>
            Unlock
          </Button>
        </div>
      </div>
      <Button v-else @click="decryptWallet" color="primary" dark>
        Unlock
      </Button>
    </template>
  </Dialog>
</template>

<script>
import Dialog from './Dialog'
import Button from './Button'
import Wallet from '../lib/dgnx-wallet'
import keystore from '../lib/keystore'

export default {
  name: 'UnlockWalletDialog',
  components: {
    Dialog,
    Button,
  },
  props: {
    show: Boolean,
    cancellable: {
      type: Boolean,
      default: function() {
        return true
      }
    }
  },
  data: () => ({
    showPassword: false,
    password: '',
    isLoading: false,
    errorMessages: [],
  }),
  methods: {
    onCancel() {
      this.$emit('cancel')
    },
    async decryptWallet() {
      this.isLoading = true

      if (this.errorMessages.length > 0) {
        this.errorMessages = []
      }

      try {
        const ks = keystore.get()
        const wallet = await Wallet.decrypt(ks, this.password)
        this.$emit('unlocked', wallet)

        this.isLoading = false
        this.password = ''

      } catch (err) {
        this.isLoading = false
        this.errorMessages = [err.message]
      }
    }
  }
}
</script>

<style>

</style>