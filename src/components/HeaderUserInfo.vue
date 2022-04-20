<template>
  <div class="d-flex align-center">
    <div>
      <v-img src="@/assets/user-profile-sample.png" max-width="35" />
    </div>
    <div>
      <div class="ml-3 text-left">
        {{ name }}
      </div>
    </div>
  </div>
</template>


<script>
import { mapState } from "vuex";

export default {
  name: "HeaderUserInfo",

  computed: {
    ...mapState({
      wallet: (state) => state.substrate.wallet
    })
  },

  data: () => ({
    name: ""
  }),
  
  async mounted() {
    this.name = this.wallet.meta.name;
  }
};
</script>

<style>
</style>
