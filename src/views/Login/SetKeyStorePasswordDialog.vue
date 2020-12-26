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
import { mapActions, mapState } from 'vuex'

export default {
  name: 'GenerateAccountDialog',
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
      isLoading: state => state.ethereum.isLoading
    })
  },
  methods: {
    ...mapActions({
      generateWallet: 'ethereum/generateWallet',
    }),
    async onPasswordSet() {
      await this.generateWallet(this.password)

      this._show = false
      this.$router.push('/')
    },
    closeDialog() {
      this._show = false
      this.setMnemonic('')
    }
  }
}
</script>

<style>

</style>

