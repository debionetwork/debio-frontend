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
        <v-form v-model="passwordsValid" ref="passwordForm">
          <v-text-field
            :append-icon="showPassword? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            outlined
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            label="Type in your password"
            :rules="[passwordRule]"
            :disabled="isLoading"
            @keyup.enter="onPasswordSet"
          >
          </v-text-field>
          <v-text-field
            :append-icon="showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPasswordConfirm = !showPasswordConfirm"
            outlined
            :type="showPasswordConfirm ? 'text' : 'password'"
            v-model="passwordConfirm"
            label="Confirm your password"
            :rules="[passwordConfirmRule(password)]"
            :disabled="isLoading"
            @keyup.enter="onPasswordSet"
          >
          </v-text-field>
        </v-form>
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
          :disabled="!passwordsValid || isLoading"
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
import { mapActions, mapState } from 'vuex'

export default {
  name: 'SetKeystorePasswordDialog',
  props: {
    secretType: String,
    secret: String,
    show: Boolean
  },
  data: () => ({
    passwordsValid: false,
    password: '',
    passwordConfirm: '',
    showPassword: false,
    showPasswordConfirm: false,
    passwordRule: val => !!val || 'Password is required',
    passwordConfirmRule: password => val => !!password && password == val || 'Passwords must match.'
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
      isLoading: state => state.ethereum.isLoadingWallet,
      wallet: state => state.ethereum.wallet,
    })
  },
  methods: {
    ...mapActions({
      generateWalletFromMnemonic: 'ethereum/generateWalletFromMnemonic',
      generateWalletFromPrivateKey: 'ethereum/generateWalletFromPrivateKey',
    }),
    async onPasswordSet() {
      try {
        if (this.secretType == 'mnemonic') {
          await this.generateWalletFromMnemonic({
            mnemonic: this.secret,
            password: this.password
          })
        }

        if (this.secretType == 'privateKey') {
          await this.generateWalletFromPrivateKey({
            privateKey: this.secret,
            password: this.password
          })
        }
        this._show = false
        this.$emit('key-store-set')
        this.$router.push('/')

      } catch (err) {
        console.log(err)
      }

    },
    closeDialog() {
      this._show = false
      this.$emit('key-store-set-cancelled')
      this.$refs.passwordForm.reset()
    }
  }
}
</script>

<style>

</style>

