<template>
  <v-dialog :value="_show" width="500" persistent>
    <v-card>
      <v-app-bar flat dense color="white">
        <v-toolbar-title class="title"> Confirm </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <v-card-text class="mt-4 pb-0 text-subtitle-1">
        <!-- Lab Recipient Details -->
        <div>
          <div class="text-h5">{{ title }}</div>
          <div class="text-body-2">
            {{ contentText }}
          </div>
        </div>

        <!-- Prompt password to sign transaction -->
        <v-text-field
          class="mt-4"
          outlined
          auto-grow
          type="password"
          @keyup.enter="onSubmit"
          v-model="password"
          label="Input your password"
          :disabled="isLoading"
        >
        </v-text-field>
        <v-alert v-if="error" dense text type="error">
          {{ error }}
        </v-alert>
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
          {{ buttonTitle }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
/* eslint-disable */
import { mapState, mapMutations } from "vuex";

export default {
  name: "DialogConfirmWithPassword",
  props: {
    title: String,
    buttonTitle: String,
    contentText: String,
    show: Boolean,
  },
  data: () => ({
    password: "",
    isLoading: false,
    error: "",
  }),
  computed: {
    _show: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit("toggle", val);
      },
    },
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
    }),
  },
  mounted() {
    
  },
  methods: {
    ...mapMutations({
       setWallet: "substrate/SET_WALLET",
    }),
    async onSubmit() {
      this.isLoading = true;
      this.error = "";
      try {
        await this.wallet.decodePkcs8(this.password);
        await this.setWallet(this.wallet);
        this.$emit('status-confirm', { status: true });
        this.closeDialog();
      } catch (err) {
        this.isLoading = false;
        this.password = "";
        this.error = "The password you entered is wrong";
      }
    },
    closeDialog() {
      this.isLoading = false;
      this._show = false;
      this.password = "";
      this.error = "";
    },
  },
};
</script>

<style>
</style>



