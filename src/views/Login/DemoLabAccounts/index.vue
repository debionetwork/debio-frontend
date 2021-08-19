<template>
  <v-menu rounded="lg">
    <template v-slot:activator="{ on, attrs }">
      <v-card
        style="max-width: 570px; margin: 0 auto; border-radius: 4px;"
        v-bind="attrs"
        v-on="on"
      >
        <v-card-title class="grey--text text--darken-2 py-2">
          <v-progress-linear v-if="isLoading" color="primary" indeterminate></v-progress-linear>
          <div class="d-flex justify-space-between" style="width: 100%;">
            <div class="text-body-1 ml-3">DEMO LAB ACCOUNTS</div>
            <v-icon>mdi-chevron-down</v-icon>
          </div>
        </v-card-title>
      </v-card>
    </template>
    <v-list>
      <v-list-item
        two-line
        v-for="(item, index) in items"
        :key="index"
        @click="loginAsLab(item)"
      >
        <v-list-item-content>
          <v-list-item-title>{{ item.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ item.country }} - {{ item.address }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mapActions } from 'vuex'
import labs from './labs.js'

export default {
  name: 'DemoLabAccounts',
  computed: {
    items() {
      return labs
    },
  },
  data: () => ({
    password: 'degenics', // Hardcoded for demo account
    isLoading: false,
  }),
  methods: {
    ...mapActions({
      generateWalletFromPrivateKey: 'ethereum/generateWalletFromPrivateKey',
    }),
    async loginAsLab(item) {
      this.$emit('lab-selected', item);
    }
  }
}
</script>

<style>

</style>