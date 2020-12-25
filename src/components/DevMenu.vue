<template>
  <v-menu
    bottom
    left
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :dark="dark"
        icon
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-dev-to</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-list>
        <router-link to="/login">
          <v-list-item link>
            <v-list-item-title>Customer Login</v-list-item-title>
          </v-list-item>
        </router-link>
        <router-link to="/">
          <v-list-item link>
            <v-list-item-title>Customer Dashboard</v-list-item-title>
          </v-list-item>
        </router-link>
        <router-link to="/lab">
          <v-list-item link>
            <v-list-item-title>Lab Dashboard</v-list-item-title>
          </v-list-item>
        </router-link>
      </v-list>
      <v-divider></v-divider>
      <v-list v-if="wallet">
        <!-- Wallet Address -->
        <v-list-item two-line>
          <v-list-item-action>
            <v-btn icon @click="copyToClipboard(walletAddress)">
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-subtitle>Wallet Address</v-list-item-subtitle>
            <v-list-item-title>{{ walletAddress }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Public Key -->
        <v-list-item two-line>
          <v-list-item-action>
            <v-btn icon @click="copyToClipboard(walletPublicKey)">
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-subtitle>Wallet Public Key</v-list-item-subtitle>
            <v-list-item-title>{{ walletPublicKey }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Private Key -->
        <v-list-item two-line>
          <v-list-item-action>
            <v-btn icon @click="copyToClipboard(walletPrivateKey)">
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-subtitle>Wallet Private Key</v-list-item-subtitle>
            <v-list-item-title>{{ walletPrivateKey }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'DevMenu',
  props: {
    dark: Boolean,
  },
  components: {
  },
  computed: {
    ...mapState({
      wallet: state => state.ethereum.wallet
    }),
    ...mapGetters({
      walletAddress: 'ethereum/getWalletAddress',
      walletPublicKey: 'ethereum/getWalletPublicKey',
      walletPrivateKey: 'ethereum/getWalletPrivateKey',
    })
  },
  methods: {
    async copyToClipboard(text) {
      await navigator.clipboard.writeText(text)
    }
  }
}
</script>

<style>

</style>
