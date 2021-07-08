<template>
  <v-dialog :value="_show" width="500" persistent>
    <v-card>
      <v-app-bar flat dense color="white">
        <v-toolbar-title class="title">
          Import Keystore JSON File
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <!-- Input password for selected keystore file -->
      <template v-if="keystore">
        <v-card-text class="mt-4 pb-0 text-subtitle-1">
          <v-form ref="form">
            <v-text-field
              v-if="fileName"
              outlined
              auto-grow
              type="password"
              v-model="password"
              label="Input password for keystore"
              :error-messages="keystoreInputErrors"
              :disabled="isLoading"
              @keyup.enter="onPasswordInput"
            ></v-text-field>
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
            <div v-else >Access Account</div>
          </v-btn>
        </v-card-actions>
      </template>

      <!-- Prompt user to select keystore file -->
      <template v-else>
        <v-card-text class="pb-0 text-subtitle-1">
          <input type="file" style="display: none" ref="keystoreFileInput" />
        </v-card-text>
        <v-card-actions class="px-6 pb-4">
          <v-btn
            depressed
            color="primary"
            large
            width="100%"
            @click="onSelectKeystoreFile"
          >
            Select Keystore File
          </v-btn>
        </v-card-actions>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
import localStorage from "../lib/local-storage";
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  name: "ImportKeystoreDialog",
  data: () => ({
    keystore: "",
    password: "",
    fileName: "",
    keystoreInputErrors: [],
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
      isLoading: state => state.substrate.isLoadingWallet
    }),
  },
  mounted() {},
  methods: {
    ...mapActions({
      restoreAccountKeystore: "substrate/restoreAccountKeystore",
    }),
    ...mapMutations({
      setIsLoading: 'substrate/SET_LOADING_WALLET'
    }),
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
      // Cannot set file input listener on mounted,
      // Because for some reason the element ref is undefined so set it on click
      this.setKeystoreFileInputListener();
      this.$refs.keystoreFileInput.click();
    },
    saveKeystoreToLocalStorage(keystore) {
      localStorage.setKeystore(keystore);
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
      this.setIsLoading(true);
      this.keystoreInputErrors = [];
      const keystore = JSON.parse(this.keystore);
      const result = await this.restoreAccountKeystore({
        file: keystore,
        password: this.password,
      });

      if (result.success) {
        this._show = false;
        this.clearInput();
        this.setIsLoading(false);
        this.$router.push("/");
        return;
      }
    },
  },
};
</script>

<style>
</style>
