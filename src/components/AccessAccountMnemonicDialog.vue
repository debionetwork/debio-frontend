<template>
  <v-dialog :value="_show" width="500" persistent>
    <v-card>
      <v-app-bar flat dense color="white">
        <!-- Use Mnemonic Phrase -->
        <v-toolbar-title class="title" v-if="type == 'login-mnemonic'">
          Login Mnemonic
        </v-toolbar-title>
        <v-toolbar-title class="title" v-else>
          Forgot Password
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <hr />
      <v-card-text class="mt-4 pb-0 text-subtitle-1">
        <v-form ref="form" v-model="formValid">
          <v-textarea
            outlined
            auto-grow
            label="Type in your mnemonic phrase."
            :rules="mnemonicRules"
            v-model="mnemonic"
          ></v-textarea>
        </v-form>
      </v-card-text>
      <v-card-actions class="px-6 pb-4">
        <v-btn
          depressed
          color="primary"
          large
          width="100%"
          @click="onContinue"
          :disabled="!formValid"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "AccessAccountMnemonicDialog",
  props: {
    show: Boolean,
    role: String,
    type: String,
  },
  data: () => ({
    formValid: true,
    mnemonic: "",
    mnemonicRules: [
      (val) => {
        return (
          (val && val.trim().split(/\s+/g).length >= 12) ||
          "Number of words must be 12 or more"
        );
      },
    ],
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
  },
  methods: {
    onContinue() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this._show = false;
      if (this.type == "login-mnemonic") {
        this.$emit("mnemonic-input-login", {
          mnemonic: this.mnemonic,
          role: this.role,
        });
      } else {
        this.$emit("mnemonic-input", {
          mnemonic: this.mnemonic,
          role: this.role,
        });
      }

      this.$refs.form.reset();
    },
    closeDialog() {
      this._show = false;
      this.$refs.form.reset();
    },
  },
};
</script>