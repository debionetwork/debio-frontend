<template>
  <v-dialog
    :value="_show"
    width="590"
    persistent
  >
    <v-card>
      <v-app-bar flat dense color="white">
        <v-toolbar-title class="title mt-5 ml-5">
          Your Secret Backup Phrase
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="closeDialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <v-card-text class="pb-0 text-subtitle-1">
        <MnemonicKeypad
            class="text-center"
            :mnemonicCollection="mnemonicCollection"
        ></MnemonicKeypad>
        <p class="pl-5 pr-5 text-center">
            <b>Write down these words in the right order and save them safely</b>
        </p>
        <p class="mt-10 primary--text" role="button" @click="handleCopyMnemonic">
          <v-icon class="primary--text">mdi-content-copy</v-icon> {{ copyText }}
        </p>
      </v-card-text>
      <v-card-actions class="px-6 pb-4">
        <v-btn
          depressed
          color="primary"
          large
          width="100%"
          @click="onMnemonicSaved"
        >
          Continue
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import MnemonicKeypad from "./MnemonicKeypad.vue"
import localStorage from "@/lib/local-storage"
const { /*cryptoWaitReady,*/ mnemonicGenerate  } = require("@polkadot/util-crypto")

let timeout = 0

export default {
  components: { MnemonicKeypad },
  name: "SecretBackupPhraseDialog",
  props: {
    show: Boolean,
    role: String
  },
  data: () => ({
    mnemonic: "",
    copyText: "Copy this Mnemonic Phrase to clipboard",
    mnemonicCollection: []
  }),
  computed: {
    _show: {
      get() {
        return this.show
      },
      set(val) {
        this.$emit("toggle", val)
      }
    }
  },
  watch: {
    _show(isShow) {
      if (isShow) {
        this.mnemonic = mnemonicGenerate()
        this.mnemonicCollection = []

        let mnemonicCollection = this.mnemonic.split(" ")
        for(let i = 1; i <= mnemonicCollection.length; i++){
          this.mnemonicCollection.push(i + " " + mnemonicCollection[i-1])
        }
      }
    }
  },
  methods: {
    onMnemonicSaved() {
      this._show = false
      this.$emit("mnemonic-generated", { mnemonic: this.mnemonic, role: this.role })
      this.mnemonic = ""
    },
    closeDialog() {
      this._show = false
      this.mnemonic = ""

      const hasAddress = localStorage.getLocalStorageByName("mnemonic_data")

      if (!hasAddress) localStorage.removeLocalStorageByName("TERMS")
    },
    async handleCopyMnemonic() {
      await navigator.clipboard.writeText(this.mnemonic)
      this.copyText = "Mnemonic has been copied successfully !"

      clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.copyText = "Copy this Mnemonic Phrase to clipboard"
      }, 1000)
    }
  }
}
</script>

<style>

</style>
