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
  mounted() {
    this.initWeb3()
  },
  methods: {
    ...mapActions({
      initWeb3: 'ethereum/initWeb3'
    })
  }
};
</script>

<style lang="scss">
</style>
