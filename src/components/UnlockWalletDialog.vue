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
import { mapGetters } from 'vuex'
import Dialog from './Dialog'
import Button from './Button'
import store from '@/store/index'

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
  computed: {
    ...mapGetters({
      api: 'substrate/getAPI',
      pair: 'substrate/wallet',
    }),
  },
  methods: {
    onCancel() {
      this.$emit('toggle')
    },
    async decryptWallet() {
      this.isLoading = true

      if (this.errorMessages.length > 0) {
        this.errorMessages = []
      }

      try {
        this.pair.unlock(this.password)

        await store.dispatch('substrate/getEncryptedAccountData', {
          password: this.password
        })

        this.isLoading = false
        this.password = ''
        
        this.$emit('toggle')

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