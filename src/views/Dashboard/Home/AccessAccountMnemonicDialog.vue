<template>
  <v-dialog
    :value="_show"
    width="500"
    persistent
  >
    <v-card>
      <v-app-bar flat dense color="white">
        <v-toolbar-title class="title">
          Use Mnemonic Phrase
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
        <v-textarea
          outlined
          auto-grow
          name="input-7-4"
          label="Type in your mnemonic phrase."
          :value="mnemonic"
          @input="setMnemonic"
        ></v-textarea>
      </v-card-text>
      <v-card-actions class="px-6 pb-4">
        <v-btn
          depressed
          color="primary"
          large
          width="100%"
          @click="onContinue"
          :disabled="!mnemonic"
        >
          Continue
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'

export default {
  name: 'AccessAccountMnemonicDialog',
  props: {
    show: Boolean
  },
  data: () => ({
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
      mnemonic: state => state.ethereum.mnemonic
    }),
  },
  methods: {
    ...mapMutations({
      setMnemonic: 'ethereum/SET_MNEMONIC',
    }),
    ...mapActions({
      generateWallet: 'ethereum/generateWallet',
    }),
    onContinue() {
      this.generateWallet()
      this._show = false
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

