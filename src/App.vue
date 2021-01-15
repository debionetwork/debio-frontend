<template>
  <div id="app">
    <div v-if="isLoading">Loading..</div>
    <router-view v-else />
  </div>
</template>

<script>
// import localStorage from './lib/local-storage'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
  },
  data: () => ({
  }),
  computed: {
    isLoading() {
      return this.isLoadingWeb3
    },
    ...mapState({
      web3: state => state.ethereum.web3,
      isLoadingWeb3: state => state.ethereum.isLoadingWeb3,
    }),
  },
  async mounted() {
  },
  methods: {
    ...mapActions({
      initWeb3: 'ethereum/initWeb3',
      initContracts: 'ethereum/contracts/initContracts'
    })
  }
};
</script>

<style lang="scss">
@import './styles/variables.scss';

@media screen and (min-width: 1904px) {
  .container {
    max-width: 1400px !important;
  }
}
.dg-card {
  border-radius: 10px !important;
  box-shadow: unset !important;
  filter: drop-shadow(0px 7px 20px rgba(0, 0, 0, 0.07));

  &.alert {
    background-color: $color-primary !important;
  }
}
</style>
