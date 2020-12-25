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
          Write this phrase on a piece of paper and store in a secure location. You will need this to access your wallet.
        </p>
        <p>
          <b class="red--text">WARNING</b>: Never disclose your backup phrase. Anyone with this phrase can take your Ether forever.
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
import { mapMutations, mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'GenerateAccountDialog',
  props: {
    show: Boolean
  },
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
      mnemonic: state => state.ethereum.mnemonic,
    }),
    ...mapGetters({
      mnemonicArray: 'ethereum/getMnemonicArray' ,
    }),
  },
  methods: {
    ...mapMutations({
      setMnemonic: 'ethereum/SET_MNEMONIC',
    }),
    ...mapActions({
      generateWallet: 'ethereum/generateWallet',
      generateMnemonic: 'ethereum/generateMnemonic'
    }),
    onMnemonicSaved() {
      this.generateWallet()
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
