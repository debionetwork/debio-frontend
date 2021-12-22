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
          We will give you 12 words that allows you to recover an account
        </p>

        <p>
          <b>
            You need to carefully save the words. Copy-paste it, screenshot it, 
            write it down, and keep it safe. If you lose it, 
            we won't be able to help you recover it.
          </b>
        </p>

        <v-checkbox v-model="agreeTerms">
          <template v-slot:label>
            <div id="checkbox">
              I understand with DeBio
              <a target="_blank" rel="noreferrer noopener" href="https://docs.debio.network/legal/privacy-policy" @click.stop> Privacy Policy</a>
              <span> and</span>
              <a target="_blank" rel="noreferrer noopener" href="https://docs.debio.network/legal/terms-and-condition" @click.stop> terms and condition</a>
            </div>
          </template>
        </v-checkbox>
      </v-card-text>
      <v-card-actions class="px-6 pb-4">
        <v-btn
          :disabled="!agreeTerms"
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
import localStorage from "@/lib/local-storage"

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

  created() {
    const hasTerms = localStorage.getLocalStorageByName("TERMS")

    if (hasTerms) this.agreeTerms = hasTerms
  },

  methods: {
    onAgreeTerms() {
      this._show = false
      this.$emit('terms-agreed')

      localStorage.setLocalStorageByName("TERMS", this.agreeTerms)
      const hasAddress = localStorage.getLocalStorageByName("mnemonic_data")

      if (!hasAddress) {
        localStorage.removeLocalStorageByName("TERMS")
        this.agreeTerms = false
      }
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
