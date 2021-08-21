<template>
  <v-dialog :value="_show" width="500" persistent>
    <v-card>
      <v-app-bar flat dense color="white">
        <v-toolbar-title class="title"> Set Password </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <v-card-text class="mt-4 pb-0 text-subtitle-1">
        <p>
          You will need to input this password later when making transactions
          with this account
        </p>
        <v-form v-model="passwordsValid" ref="passwordForm">
          <v-text-field
            outlined
            :type="'text'"
            v-model="accountName"
            label="Type in account name"
            :disabled="isLoading"
          >
          </v-text-field>
          <v-text-field
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
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
        <div class="d-flex justify-center mb-4">
          <VueRecaptcha
            @verify="onVerifyRecaptcha"
            :sitekey="sitekey"
          ></VueRecaptcha>
        </div>
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
          :disabled="!passwordsValid || !recaptchaVerified || isLoading"
          :loading="isLoading"
        >
          <v-progress-circular
            v-if="isLoading"
            :size="20"
            color="white"
            indeterminate
          ></v-progress-circular>
          <div v-else>Set Password</div>
          <template v-slot:loader>
            <span>Setting Up Account</span>
          </template>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import VueRecaptcha from "vue-recaptcha";
import axios from "axios";

export default {
  name: "SetKeystorePasswordDialog",
  components: {
    VueRecaptcha,
  },
  props: {
    secretType: String,
    secret: String,
    show: Boolean,
  },
  data: () => ({
    passwordsValid: false,
    password: "",
    passwordConfirm: "",
    showPassword: false,
    showPasswordConfirm: false,
    passwordRule: (val) => !!val || "Password is required",
    passwordConfirmRule: (password) => (val) =>
      (!!password && password == val) || "Passwords must match.",
    recaptchaVerified: false,
    accountName: "",
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
    sitekey() {
      return process.env.VUE_APP_RECAPTCHA_SITE_KEY;
    },
    ...mapState({
      substrateApi: (state) => state.substrate.api,
      isLoading: (state) => state.substrate.isLoadingWallet,
    }),
  },
  mounted() {
    let recaptchaScript = document.createElement("script");
    const recaptchaSrc =
      "https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit";
    recaptchaScript.setAttribute("src", recaptchaSrc);
    recaptchaScript.setAttribute("async", true);
    recaptchaScript.setAttribute("defer", true);
    document.head.appendChild(recaptchaScript);
  },
  methods: {
    ...mapActions({
      registerMnemonic: "substrate/registerMnemonic",
    }),
    ...mapMutations({
      setIsLoading: "substrate/SET_LOADING_WALLET",
    }),
    async onVerifyRecaptcha(response) {
      console.log(response)
      let recaptchaBackendUrl = ''
      if (process.env.NODE_ENV == 'demo') {
        recaptchaBackendUrl = `${process.env.VUE_APP_DEGENICS_BACKEND_URL}/recaptcha`;
      } else {
        recaptchaBackendUrl = `${process.env.VUE_APP_DEV_DEGENICS_BACKEND_URL}/recaptcha`;
      }
      const result = await axios.post(recaptchaBackendUrl, { response });

      if (result.data.success) {
        this.recaptchaVerified = true;
      }
    },
    async onPasswordSet() {
      try {
        if (this.secretType == "mnemonic") {
          if (this.accountName == "") {
            this.accountName = "Account Name";
          }
          this.setIsLoading(true);
          const result = await this.registerMnemonic({
            mnemonic: this.secret,
            password: this.password,
            accountName: this.accountName,
          });
          if (result.success) {
            this._show = false;
            this.$emit("key-store-set");
            //this.$router.push("/");
            this.setIsLoading(false);
            return;
          }
        }

        if (this.secretType == "privateKey") {
          await this.generateWalletFromPrivateKey({
            privateKey: this.secret,
            password: this.password,
          });
          this._show = false;
          this.$emit("key-store-set");
          //this.$router.push("/");
          this.setIsLoading(false);
          return;
        }
      } catch (err) {
        this.setIsLoading(false);
        console.log(err);
      }
    },
    closeDialog() {
      this._show = false;
      this.$emit("key-store-set-cancelled");
      this.$refs.passwordForm.reset();
    },
  },
};
</script>

<style>
</style>

