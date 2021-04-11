<template>
  <v-menu
    bottom
    left
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        dark
        icon
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-list>
        <v-list-item two-line @click="downloadKeystore">
          <v-list-item-action>
            <v-icon>mdi-file-key</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Download Keystore File</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item two-line @click="logOut">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Log Out</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import localStorage from '../lib/local-storage'
import { mapActions, mapMutations } from 'vuex'

export default {
  methods: {
    ...mapActions({
      clearAuth: 'auth/clearAuth',
    }),
    ...mapMutations({
      clearWallet: 'substrate/CLEAR_WALLET',
    }),
    logOut() {
      this.clearAuth()
      //this.clearWallet()
      localStorage.clear()
      this.$router.push('/login')
    },
    downloadKeystore() {
      const keystore = localStorage.getKeystore()
      const blob = new Blob([ keystore ], {type: 'text/plain'})
      const e = document.createEvent('MouseEvents')
      const a = document.createElement('a')
      a.download = 'keystore.json'
      a.href = window.URL.createObjectURL(blob)
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      a.dispatchEvent(e)
    },
  }
}
</script>

<style>

</style>
