<template>
  <v-dialog
    :value="_show"
    width="500"
    persistent
  >
    <v-card>
      <v-app-bar flat dense color="white">
        <v-toolbar-title class="title">
          Paste Private Key
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
        <v-text-field
          outlined
          auto-grow
          type="password"
          :value="importPrivateKeyInput"
          @input="setImportPrivateKeyInput"
          label="Input your private key"
          :disabled="isLoading"
        >
        </v-text-field>
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
          @click="onContinue"
          :disabled="!importPrivateKeyInput"
        >
          Continue
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'UsePrivateKeyDialog',
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
      importPrivateKeyInput: state => state.ethereum.importPrivateKeyInput,
      isLoading: state => state.ethereum.isLoading
    }),
  },
  methods: {
    ...mapMutations({
      setImportPrivateKeyInput: 'ethereum/SET_IMPORT_PRIVATE_KEY_INPUT',
    }),
    onContinue() {
      this._show = false
      this.$emit('private-key-imported')
    },
    closeDialog() {
      this._show = false
      this.setImportPrivateKeyInput('')
    }
  }
}
</script>

<style>

</style>


