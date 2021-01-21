<template>
  <v-menu offset-y rounded="lg">
    <template v-slot:activator="{ on, attrs }">
      <v-card
        class="dg-card px-4"
        style="max-width: 400px; margin: 0 auto; border-radius: 30px;"
        v-bind="attrs"
        v-on="on"
      >
        <v-card-title class="grey--text text--darken-2">
          <v-progress-linear v-if="isLoading" color="primary" indeterminate></v-progress-linear>
          <div class="d-flex justify-space-between" style="width: 100%;">
            <div>Demo Lab Accounts</div>
            <v-icon>mdi-chevron-down</v-icon>
          </div>
        </v-card-title>
      </v-card>
    </template>
    <v-list style="max-width: 400px;">
      <v-list-item
        two-line
        v-for="(item, index) in items"
        :key="index"
        @click="loginAsLab(item)"
      >
        <v-list-item-content>
          <v-list-item-title>{{ item.lab }}</v-list-item-title>
          <v-list-item-subtitle>{{ item.address }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mapActions } from 'vuex'
import labs from './labs.json'

export default {
  name: 'DemoLabAccounts',
  computed: {
    items() {
      return labs
    },
  },
  data: () => ({
    password: 'degenics' // Hardcoded for demo account
  }),
  methods: {
    ...mapActions({
      generateWalletFromPrivateKey: 'ethereum/generateWalletFromPrivateKey',
    }),
    async loginAsLab(item) {
      try {
        this.isLoading = true
        await this.generateWalletFromPrivateKey({
          privateKey: item.privateKey,
          password: this.password
        })
        this.isLoading = false
        this.$router.push('/')
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style>

</style>