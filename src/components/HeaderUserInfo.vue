<template>
  <v-menu bottom left>
    <template v-slot:activator="{ on, attrs }">
      <div class="d-flex align-center mr-4" v-bind="attrs" v-on="on">
        <div class="d-flex align-center">
          <div style="cursor: pointer">
            <v-img src="@/assets/user-profile-sample.png" max-width="35" />
          </div>
          <div>
            <!-- :class="hover ? 'primary--text' : ''" -->
            <div class="ml-3 text-left">
              {{ name }}
            </div>
            <div class="ml-3 light_primary--text" style="font-size: 14px">
              {{ balance }}
            </div>
          </div>
        </div>
      </div>
    </template>
    <v-card>
      <v-list>
        <v-list-item two-line @click="downloadKeystore">
          <v-list-item-action>
            <v-icon>mdi-file-key</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Download Keystore File</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item two-line @click="logOut">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Log Out</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import localStorage from "@/lib/local-storage";

export default {
  name: "HeaderUserInfo",
  computed: {
    ...mapState({
      walletBalance: (state) => state.substrate.walletBalance,
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
    }),
  },
  data: () => ({
    isLoading: false,
    balance: 0,
    name: "",
  }),
  methods: {
    ...mapMutations({
      setWalletBalance: "substrate/SET_WALLET_BALANCE",
      clearWallet: "substrate/CLEAR_WALLET",
    }),
    ...mapActions({
      clearAuth: "auth/clearAuth",
    }),
    async fetchWalletBalance() {
      try {
        this.isLoading = true;
        const { nonce, data: balance } = await this.api.query.system.account(
          this.wallet.address
        );

        this.balance = balance.free.toHuman();
        if (this.balance == "0"){
          this.balance = "0 DBIO";
        } 

        this.name = this.wallet.meta.name;
        console.log("nonce", nonce);
        this.setWalletBalance(balance.free.toHuman());
        this.isLoading = false;
      } catch (err) {
        console.log(err);
        this.isLoading = false;
      }
    },
    logOut() {
      this.clearAuth();
      localStorage.clear();
      this.$router.push("/login");
    },
    downloadKeystore() {
      const keystore = localStorage.getKeystore();
      const blob = new Blob([keystore], { type: "text/plain" });
      const e = document.createEvent("MouseEvents");
      const a = document.createElement("a");
      a.download = "keystore.json";
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
      e.initEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      a.dispatchEvent(e);
    },
  },
  watch: {
    async wallet(val) {
      if (val) {
        await this.fetchWalletBalance();
      }
    },
  },
  async mounted() {
    await this.fetchWalletBalance();
  },
};
</script>

<style>
</style>
