<template>
  <div class="d-flex align-center mr-4">
    <v-icon class="mr-2">mdi-wallet</v-icon>
    <div v-if="isLoading">Loading..</div>
    <div v-else class="text-body-1 light_primary--text"><b>{{ walletBalance }}</b> Eth</div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import keystore from '../lib/keystore'
import getWalletBalance from '../lib/get-wallet-balance'

export default {
  name: 'WalletBalance',
  computed: {
    ...mapState({
      web3: state => state.ethereum.web3,
      walletBalance: state => state.ethereum.walletBalance,
    }),
  },
  data: () => ({
    isLoading: false,
  }),
  methods: {
    ...mapMutations({
      setWalletBalance: 'ethereum/SET_WALLET_BALANCE'
    })
  },
  async mounted() {
    if (!this.walletBalance) {
      try {
        this.isLoading = true
        const ks = keystore.get()
        const balance = await getWalletBalance(this.web3, ks.address)
        this.setWalletBalance(balance)
        this.isLoading = false
      } catch (err) {
        console.log(err)
        this.isLoading = false
      }
    }
  }
}
</script>

<style>

</style>