<template>
  <v-dialog :value="_show" max-width="500" persistent>
    <v-card>
      <v-app-bar flat dense color="white">
        <v-toolbar-title class="title"> Sign In </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <!-- Input password for selected keystore file -->
      <hr />
      <div v-if="!loading">
        <template v-if="keystore">
          <v-card-text class="mt-4 pb-0 text-subtitle-1">
            <v-form ref="form">
              <div style="font-size: 12px">Please enter your password</div>
              <v-text-field
                v-if="fileName"
                outlined
                auto-grow
                type="password"
                v-model="password"
                :error-messages="keystoreInputErrors"
                :disabled="isLoading"
                @keyup.enter="onPasswordInput"
              ></v-text-field>
              <div
                style="font-size: 12px"
                class="d-flex justify-end primary--text"
                @click="forgotPassword"
              >
                Forgot your password?
              </div>
            </v-form>
            <v-progress-linear
              v-if="isLoading"
              indeterminate
              color="red"
            ></v-progress-linear>
          </v-card-text>
          <v-card-actions class="px-6 pb-4">
            <v-btn
              depressed
              color="primary"
              large
              width="100%"
              :disabled="!password"
              @click="onPasswordInput"
            >
              <v-progress-circular
                v-if="isLoading"
                :size="20"
                color="white"
                indeterminate
              ></v-progress-circular>
              <div v-else>Submit</div>
            </v-btn>
          </v-card-actions>
        </template>

        <!-- Prompt user to select keystore file -->
        <template v-if="dataAccount != null && keystore == ''">
          <v-hover v-slot="{ hover }">
            <v-card
              class="mt-3 mb-10"
              :class="{ 'card-hover': hover }"
              @click="setKeystore"
              elevation="0"
            >
              <div class="d-flex align-center">
                <div class="my-5 ml-5">
                  <v-img
                    src="@/assets/user-profile-sample.png"
                    max-width="48"
                  />
                </div>
                <div>
                  <div
                    class="ml-5 text-left"
                    :class="hover ? 'primary--text' : ''"
                  >
                    {{ dataAccount.meta.name }}
                  </div>
                  <div class="ml-5 primary--text" style="font-size: 14px">
                    {{ balance }} DOT
                  </div>
                  <div class="ml-5 grey--text" style="font-size: 12px">
                    {{ dataAccount.address }}
                  </div>
                </div>
              </div>
            </v-card>
          </v-hover>
        </template>

        <template v-else-if="keystore == ''">
          <div class="d-flex justify-center mb-5 mt-5">
            <v-img src="@/assets/warning.png" max-width="48" />
          </div>
          <div align="center" class="mb-5">No accounts found.</div>
        </template>

        <template v-if="keystore == ''">
          <v-card-text class="pb-0 text-subtitle-1">
            <input type="file" style="display: none" ref="keystoreFileInput" />
            <div style="width: 100%;">
              <v-btn
                depressed
                color="primary"
                medium
                width="100%"
                @click="showMnemonicForm"
              >
                Input Mnemonic
              </v-btn>
              <div class="py-2" align="center">OR</div>
              <v-btn
                depressed
                color="primary"
                medium
                width="100%"
                @click="onSelectKeystoreFile"
              >
                Import Keystore File
              </v-btn>
            </div>
          </v-card-text>
          <v-card-actions class="px-6 pb-4">
          </v-card-actions>
        </template>
      </div>
      <div v-else class="d-flex justify-center mt-10 pb-10">
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </div>
    </v-card>
  </v-dialog>
</template>
   

<script>
import localStorage from "../lib/local-storage";
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  name: "DialogSelectUserLogin",
  data: () => ({
    keystore: "",
    password: "",
    fileName: "",
    dataAccount: null,
    dataAccountJson: "",
    balance: 0,
    nonce: null,
    keystoreInputErrors: [],
    loading: false,
  }),
  props: {
    show: Boolean,
  },
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
      isLoading: (state) => state.substrate.isLoadingWallet,
      api: (state) => state.substrate.api,
    }),
  },
  async mounted() {
    await this.getKeyStoreLocal();
  },
  methods: {
    ...mapActions({
      restoreAccountKeystore: "substrate/restoreAccountKeystore",
    }),
    ...mapMutations({
      setIsLoading: "substrate/SET_LOADING_WALLET",
    }),
    async getKeyStoreLocal() {
      try {
        this.loading = true;
        this.dataAccountJson = localStorage.getKeystore();
        this.dataAccount = JSON.parse(this.dataAccountJson);
        const { nonce, data: balance } = await this.api.query.system.account(
          this.dataAccount.address
        );
        this.balance = balance.free.toHuman();
        this.nonce = nonce;
        this.loading = false;
      } catch (err) {
        console.log(err);
        this.loading = false;
      }
    },
    setKeystore() {
      this.keystore = this.dataAccountJson
      this.fileName = "keystore"
    },
    setKeystoreFileInputListener() {
      const context = this;
      this.$refs.keystoreFileInput.addEventListener("change", function () {
        const file = this.files[0];
        context.fileName = file.name;
        const fr = new FileReader();
        fr.onload = async function () {
          // TODO: Validate if valid keystore
          context.keystore = fr.result;
        };
        fr.readAsText(file);
      });
    },
    onSelectKeystoreFile() {
      this.setKeystoreFileInputListener();
      this.$refs.keystoreFileInput.click();
    },
    saveKeystoreToLocalStorage(keystore) {
      localStorage.setKeystore(keystore);
    },
    forgotPassword(){
      const dataPair = JSON.parse(this.keystore);
      this._show = false;
      this.$emit('forgot-password', { status: true, address: dataPair.address })
      this.clearInput();
    },
    closeDialog() {
      this._show = false;
      this.clearInput();
    },
    clearInput() {
      (this.keystore = ""),
        (this.password = ""),
        (this.fileName = ""),
        (this.keystoreInputErrors = []);
    },
    async onPasswordInput() {
      this.loading = true;
      this.setIsLoading(true);
      this.keystoreInputErrors = [];
      const keystore = JSON.parse(this.keystore);
      const result = await this.restoreAccountKeystore({
        file: keystore,
        password: this.password,
      });

      this.loading = false;
      if (result.success) {
        this._show = false;
        this.clearInput();
        this.$emit('key-store-set')
        return;
      } else {
        this.keystoreInputErrors = result.error;
      }
    },
    showMnemonicForm() {
      this.$emit('show-mnemonic-form')
    }
  },
};
</script>

<style>
</style>
