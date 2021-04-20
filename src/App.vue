<template>
  <div id="app">
    <div v-if="isLoadingSubstrateApi">Loading..</div>
    <router-view v-else />
  </div>
</template>

<script>
//import localStorage from './lib/local-storage'
import globalFunctions from "./lib/functions";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "App",
  components: {},
  computed: {
    ...mapState({
      substrateApi: (state) => state.substrate.api,
      isLoadingSubstrateApi: (state) => state.substrate.isLoadingApi,
    }),
  },
  data: () => ({
    address: "",
  }),
  async mounted() {
    this.address = await globalFunctions.checkIsLoggedIn();
    await this.connectSubstrate();
    if (this.address != "") {
      await this.getAkun({
        address: this.address,
      });
    }
  },
  methods: {
    ...mapActions({
      connectSubstrate: "substrate/connect",
      getAkun: "substrate/getAkun",
    }),
    ...mapMutations({
      setWallet: "substrate/SET_WALLET",
    }),
  },
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
