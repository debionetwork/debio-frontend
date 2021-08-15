<template>
  <v-dialog
    :value="_show"
    width="500"
    persistent
  >
    <v-card>
      <v-app-bar flat dense color="white">
        <v-toolbar-title class="title">
          Backup Your Account !
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
        We will give you 12 words that allow you to recover your account.
        </p>

        <p>
          <b>You need to carefully save those words. Copy-paste it, screenshot it, write it down, and keep it safe -if you lose it, we won't be able to help you recover it.</b>
        </p>

        <v-checkbox
          v-model="agreeTerms"
          label="I understand that if I lose my recovery words, I will not be able to access my account"
        ></v-checkbox>
      </v-card-text>
      <v-card-actions class="px-6 pb-4">
        <v-btn
          :disabled="agreeTerms == false"
          depressed
          color="primary"
          large
          width="100%"
          @click="onAgreeTerms"
        >
          Continue
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'GenerateAccountDialog',
  props: {
    show: Boolean,
    role: String,
  },
  data: () => ({
    agreeTerms: false,
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
    onAgreeTerms() {
      this._show = false
      this.$emit('terms-agreed')
      this.agreeTerms = false
    },
    closeDialog() {
      this._show = false
      this.agreeTerms = false
    }
  }
}
</script>

<style>

</style>
