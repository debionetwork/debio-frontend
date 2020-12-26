<template>
  <v-dialog
    :value="_show"
    width="500"
    persistent
  >
    <v-card>
      <v-app-bar flat dense color="white">
        <v-toolbar-title class="title">
          Set Password
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
        <p>
          You will need to input this password later when making transactions with this account
        </p>
        <v-text-field
          outlined
          auto-grow
          type="password"
          v-model="password"
          label="Type in your password"
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
          @click="onPasswordSet"
          :disabled="!password || isLoading"
          :loading="isLoading"
        >
          Set Password
          <template v-slot:loader>
            <span>Setting Up Account</span>
          </template>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  name: 'SetKeystorePasswordDialog',
  props: {
    show: Boolean
  },
  data: () => ({
    password: ''
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
      isLoading: state => state.ethereum.isLoading,
      mnemonic: state => state.ethereum.mnemonic,
      importPrivateKeyInput: state => state.ethereum.importPrivateKeyInput,
    })
  },
  methods: {
    ...mapActions({
      generateWalletFromMnemonic: 'ethereum/generateWalletFromMnemonic',
      generateWalletFromPrivateKey: 'ethereum/generateWalletFromPrivateKey',
    }),
    ...mapMutations({
      setMnemonic: 'ethereum/SET_MNEMONIC',
      setImportPrivateKeyInput: 'ethereum/SET_IMPORT_PRIVATE_KEY_INPUT',
    }),
    async onPasswordSet() {
      if (this.mnemonic) {
        await this.generateWalletFromMnemonic(this.password)
      }
      if (this.importPrivateKeyInput) {
        await this.generateWalletFromPrivateKey(this.password)
      }

      this.closeDialog()
      this.$router.push('/')
    },
    closeDialog() {
      this._show = false
      // Clear import account inputs
      this.setMnemonic('')
      this.setImportPrivateKeyInput('')
    }
  }
}
</script>

<style>

</style>

