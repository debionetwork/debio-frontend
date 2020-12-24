<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'App',
  data: () => ({
  }),
  computed: {
    ...mapState({
      web3: state => state.web3.instance,
      isLoadingWeb3: state => state.web3.isLoading,
    })
  },
  mounted() {
    this.initWeb3()
  },
  methods: {
    ...mapActions({
      initWeb3: 'web3/initWeb3'
    })
  }
};
</script>
