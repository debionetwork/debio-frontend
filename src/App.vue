<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
  },
  data: () => ({
  }),
  computed: {
    ...mapState({
      web3: state => state.ethereum.web3,
      isLoadingWeb3: state => state.ethereum.isLoading,
    })
  },
  async mounted() {
    await this.initWeb3()
    this.initContracts()
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

  &.alert {
    background-color: $color-primary !important;
  }
}
</style>
