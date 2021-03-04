<template>
  <div class="d-flex align-center mr-4">
    <v-icon class="mr-2">mdi-wallet</v-icon>
    <div v-if="isLoading">Loading..</div>
    <div v-else class="text-body-1 light_primary--text"><b>{{ walletBalance }}</b></div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'WalletBalance',
  computed: {
    ...mapState({
      walletBalance: state => state.substrate.walletBalance,
      api: state => state.substrate.api,
      wallet: state => state.substrate.wallet
    }),
  },
  data: () => ({
    isLoading: false,
  }),
  methods: {
    ...mapMutations({
      setWalletBalance: 'substrate/SET_WALLET_BALANCE',
    }),
    async fetchWalletBalance() {
      try {
        this.isLoading = true
        console.log('address', this.wallet.address)
        const { nonce, data: balance  } = await this.api.query.system.account(this.wallet.address);
        console.log('nonce', nonce)
        console.log('balance', balance.free.toHuman())
        this.setWalletBalance(balance.free.toHuman())
        this.isLoading = false
      } catch (err) {
        console.log(err)
        this.isLoading = false
      }
    }
  },
  watch: {
    async wallet(val) {
      if (val) {
        await this.fetchWalletBalance()
      }
    }
  },
  async mounted() {
    await this.fetchWalletBalance()
  }
}
</script>

<style>

</style>
