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
        <v-form ref="form" v-model="formValid">
          <v-text-field
            outlined
            auto-grow
            type="password"
            v-model="privateKey"
            :rules="privateKeyRules"
            label="Input your private key"
          >
          </v-text-field>
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
          Continue
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'UsePrivateKeyDialog',
  props: {
    show: Boolean
  },
  data: () => ({
    formValid: true,
    privateKey: '',
    privateKeyRules: [
      value => {
        const pattern = /^(0x)?[0-9a-fA-F]{64}$/
        return pattern.test(value)
          || 'Invalid private key'
      }
    ],
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
  methods: {
    onContinue() {
      this._show = false
      const privateKey = this.privateKey.startsWith('0x')
        ? this.privateKey
        : '0x' + this.privateKey
      this.$emit('private-key-input', privateKey)
      this.$refs.form.reset()
    },
    closeDialog() {
      this._show = false
      this.$refs.form.reset()
    }
  }
}
</script>

<style>

</style>


