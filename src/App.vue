<template>
  <div id="app">
    <LoadingScreen v-show="isLoadingSubstrateApi">Loading..</LoadingScreen>
    <router-view v-show="!isLoadingSubstrateApi" />
  </div>
</template>

<script>
import LoadingScreen from "@/views/LoadingScreen"
import { mapState, mapActions } from "vuex";

export default {
  name: "App",
  components: { LoadingScreen },
  computed: {
    ...mapState({
      substrateApi: (state) => state.substrate.api,
      isLoadingSubstrateApi: (state) => state.substrate.isLoadingApi,
      web3: (state) => state.metamask.web3
    })
  },
  data: () => ({
    address: ""
  }),
  methods: {
    ...mapActions({
      initWeb3: "metamask/initWeb3",
      initContracts: "metamask/contracts/initContracts"
    })
  }
};
</script>

<style lang="scss">
@import "./styles/variables.scss";

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
