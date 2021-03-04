<template>
  <v-dialog
    :value="_show"
    width="500"
    persistent
  >
    <v-card>
      <v-app-bar flat dense color="white">
        <v-toolbar-title class="title">
          Secret Backup Phrase
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
        <p>
        This sentence is a way to input your private key: a secret code that makes sure nobody can access your data without your permission.
        </p>

        <p>
Your private key isn't stored anywhere. It never leaves your device and must remain absolutely secret.
        </p>

        <p>
<b>For this reason, you need to carefully save this sentence. Copy-paste it, screenshot it, write it down, and keep it safe -if you lose it, we won't be able to help you recover it. </b>
        </p>
        <v-card outlined class="grey--text text--darken-3 text-h5 text-center px-5 py-5">
          {{ mnemonic }}
        </v-card>
      </v-card-text>
      <v-card-actions class="px-6 pb-4">
        <v-btn
          depressed
          color="primary"
          large
          width="100%"
          @click="onMnemonicSaved"
        >
          I Wrote Down My Mnemonic Phrase
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
const { /*cryptoWaitReady,*/ mnemonicGenerate  } = require('@polkadot/util-crypto')

export default {
  name: 'GenerateAccountDialog',
  props: {
    show: Boolean,
    role: String,
  },
  data: () => ({
    mnemonic: '',
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
  },
  watch: {
    _show(isShow) {
      if (isShow) {
        this.mnemonic = mnemonicGenerate()
      }
    }
  },
  methods: {
    onMnemonicSaved() {
      this._show = false
      this.$emit('mnemonic-generated', { mnemonic: this.mnemonic, role: this.role })
      this.mnemonic = ''
    },
    closeDialog() {
      this._show = false
      this.mnemonic = ''
    }
  }
}
</script>

<style>

</style>
