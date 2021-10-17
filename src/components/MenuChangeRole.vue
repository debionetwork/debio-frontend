<template>
  <v-menu bottom left>
    <template v-slot:activator="{ on, attrs }">
      <div
        class="
          d-flex
          align-center
          light_primary--text
          caption
          text-decoration-underline
        "
        v-bind="attrs"
        v-on="on"
      >
        Change
      </div>
    </template>

    <div class="mt-11">
      <v-card>
        <v-list>
          <router-link to="/customer">
            <v-list-item link>
              <v-list-item-title>Customer</v-list-item-title>
            </v-list-item>
          </router-link>
          <router-link to="/lab">
            <v-list-item link>
              <v-list-item-title>Lab</v-list-item-title>
            </v-list-item>
          </router-link>
          <router-link to="/hospital">
            <v-list-item link>
              <v-list-item-title>Hospital</v-list-item-title>
            </v-list-item>
          </router-link>
          <router-link to="/doctor">
            <v-list-item link>
              <v-list-item-title>Doctor</v-list-item-title>
            </v-list-item>
          </router-link>
        </v-list>
      </v-card>
    </div>
  </v-menu>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  name: "MenuChangeRole",
  props: {
    dark: Boolean,
  },
  components: {},
  computed: {
    ...mapState({
      wallet: (state) => state.ethereum.wallet,
    }),
    ...mapGetters({
      walletAddress: "ethereum/getWalletAddress",
      walletPublicKey: "ethereum/getWalletPublicKey",
      walletPrivateKey: "ethereum/getWalletPrivateKey",
    }),
  },
  methods: {
    async copyToClipboard(text) {
      await navigator.clipboard.writeText(text);
    },
  },
};
</script>

<style>
</style>
