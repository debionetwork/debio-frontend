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
        @keyup.enter="decryptWallet"
      >
      </v-text-field>
      <v-progress-linear
        v-if="isLoading"
        indeterminate
        color="primary"
      ></v-progress-linear>
    </template>
    <template v-slot:actions>
      <div class="button-wrapper d-flex justify-space-between align-center px-2">
        <router-link :to="{ name: 'login', query: { forgot: 1 } }" class="forgot-btn">FORGOT PASSWORD</router-link>
        <Button class="unlock-btn" @click="decryptWallet" color="primary" dark>
          Unlock
        </Button>
      </div>
    </template>
  </Dialog>
</template>

<script>
import { mapGetters } from "vuex"
import Dialog from "./Dialog"
import Button from "./Button"
import store from "@/store/index"
import errorMessages from "../../src/constants/error-messages"

export default {
  name: "UnlockWalletDialog",

  components: {
    Dialog,
    Button
  },

  props: { show: Boolean },

  data: () => ({
    showPassword: false,
    password: "",
    isLoading: false,
    errorMessages: []
  }),

  computed: {
    ...mapGetters({
      api: "substrate/getAPI",
      pair: "substrate/wallet"
    })
  },

  methods: {
    async decryptWallet() {
      this.isLoading = true

      if (this.errorMessages.length > 0) {
        this.errorMessages = []
      }

      try {
        this.pair.unlock(this.password)

        await store.dispatch("substrate/getEncryptedAccountData", {
          password: this.password
        })

        this.isLoading = false
        this.password = ""
        
        this.$emit("toggle")

      } catch (err) {
        this.isLoading = false
        if (err.message === "Unable to decode using the supplied passphrase") this.errorMessages = [errorMessages.INCORRECT("password")]
        else this.errorMessages = [err.message]
      }
    }
  }
}
</script>

<style lang="scss">
  .button-wrapper {
    width: 100%;
  }

  .forgot-btn {
    font-size: 14px;
  }
  .unlock-btn {
    width: 50% !important;
  }
</style>
