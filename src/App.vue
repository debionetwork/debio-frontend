<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ipfsWorker from './web-workers/ipfs-worker'

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
    ipfsWorker.postMessage({ param: "myparam" }) // Access this object in e.data in worker
    ipfsWorker.onmessage = event => {
      console.log(event)
    }
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
