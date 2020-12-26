<template>
  <v-dialog
    :value="_show"
    width="500"
    persistent
  >
    <v-card>
      <v-app-bar flat dense color="white">
        <v-toolbar-title class="title">
          Import Keystore JSON File
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
    </v-card>
  </v-dialog>
</template>

<script>
import localStorage from '../../lib/local-storage'

export default {
  name: 'ImportKeystoreDialog',
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
  },
  mounted() {
  },
  methods: {
    setKeystoreFileInputListener() {
      const context = this
      this.$refs.keystoreFileInput.addEventListener('change', function() {
        const file = this.files[0]
        context.fileName = file.name
        const fr = new FileReader()
        fr.onload = async function() {
          // TODO: Validate if valid keystore
          context.saveKeystoreToLocalStorage(fr.result)
          context._show = false
          context.$router.push('/')
        }
        fr.readAsText(file)
      })
    },
    onSelectKeystoreFile() {
      // Cannot set file input listener on mounted,
      // Because for some reason the element ref is undefined so set it on click
      this.setKeystoreFileInputListener()
      this.$refs.keystoreFileInput.click()
    },
    saveKeystoreToLocalStorage(keystore) {
      localStorage.setKeystore(keystore)
    },
    closeDialog() {
      this._show = false
    }
  }
}
</script>

<style>

</style>
