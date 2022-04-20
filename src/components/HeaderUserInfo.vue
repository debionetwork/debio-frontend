<template>
  <div class="d-flex align-center">
    <div>
      <v-img :src="computedAvatar" max-width="35" />
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
      wallet: (state) => state.substrate.wallet,
      labAccount: (state) => state.substrate.labAccount
    })

    computedAvatar() {
      return this.labAccount.info.profileImage ?? require("@/assets/user-profile-sample.png")
    }
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
