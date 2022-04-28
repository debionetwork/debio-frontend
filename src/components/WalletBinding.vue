<template>
  <v-dialog :value="_show" width="500" persistent>
    <v-card class="pb-5">
      <v-app-bar flat dense color="white">
        <v-toolbar-title class="title">
          Connect To Your Wallet
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <hr />
      <div v-if="loading">
        <div class="mt-10 mb-10" align="center">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
      </div>
      <div v-if="!loading">
        <v-card
          class="ml-10 mb-10 mr-10 dg-card pb-2 pt-2 mt-10"
          style="background: #eeeeee"
          elevation="0"
          outlined
          v-if="putWallet"
          @click="setWalllet('metamask')"
        >
          <div class="ml-5 mr-5">
            <v-row class="align-center">
              <v-col cols="12" lg="2" md="2" xl="2">
                <div style="cursor: pointer">
                  <v-img src="@/assets/metamask-icon.png" max-width="40" />
                </div>
              </v-col>
              <v-col cols="12" lg="8" md="8" xl="8">
                <div class="d-flex align-center">
                  <div class="ml-3 text-h5 text-left">Metamask</div>
                </div>
              </v-col>
              <v-col cols="12" lg="2" md="2" xl="2">
                <v-icon color="primary" :size="25"> mdi-arrow-right </v-icon>
              </v-col>
            </v-row>
          </div>
        </v-card>

        <div class="mt-10 mb-10 ml-10 mr-10" v-if="putAccount">
          <div align="center" class="align-center mb-2">
            <v-img src="@/assets/debio-logo.png" max-width="50" />
          </div>
          <div align="center" class="align-center mb-5">DeBio</div>
          <div align="center" class="align-center mb-2">Select account(s)</div>
          <div v-for="account in accountList" :key="account.address">
            <v-card
              class="dg-card pb-2 pt-2"
              style="background: #eeeeee"
              elevation="0"
              outlined
              :disabled="account.active"
              @click="setAccount(account)"
            >
              <div class="ml-5 mr-5">
                <v-row class="align-center">
                  <v-col cols="12" lg="2" md="2" xl="2">
                    <div style="cursor: pointer">
                      <v-img src="@/assets/user-eth.png" max-width="40" />
                    </div>
                  </v-col>
                  <v-col cols="12" lg="8" md="8" xl="8">
                    <div class="ml-3 text-left font-weight-bold">
                      {{ account.name }} (...{{ account.lastAddr }})
                    </div>
                    <div class="ml-3 text-left">{{ account.balance }} DAI</div>
                  </v-col>
                  <v-col cols="12" v-if="account.active" lg="2" md="2" xl="2">
                    <v-icon color="green" :size="25"> mdi-check-bold </v-icon>
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </div>
        </div>
        <div class="mt-10 mb-2 ml-10 mr-10" v-if="inputPassword">
          <v-card
            class="mb-5 dg-card pb-2 pt-2"
            style="background: #eeeeee"
            elevation="0"
            outlined
          >
            <div class="ml-5 mr-5">
              <v-row class="align-center">
                <v-col cols="12" lg="2" md="2" xl="2">
                  <div style="cursor: pointer">
                    <v-img src="@/assets/user-eth.png" max-width="40" />
                  </div>
                </v-col>
                <v-col cols="12" lg="8" md="8" xl="8">
                  <div class="ml-3 text-left font-weight-bold">
                    {{ selectAccount.name }} (...{{ selectAccount.lastAddr }})
                  </div>
                  <div class="ml-3 text-left">
                    {{ selectAccount.balance }} DAI
                  </div>
                </v-col>
                <v-col cols="12" lg="2" md="2" xl="2">
                  <v-icon color="orange" :size="25">
                    mdi-radiobox-marked
                  </v-icon>
                </v-col>
              </v-row>
            </div>
          </v-card>
          <div class="align-center">Input Debio Account Password</div>
          <!-- Prompt password to sign transaction -->
          <v-text-field
            class="mt-2"
            outlined
            auto-grow
            type="password"
            @keyup.enter="onSubmit"
            v-model="password"
            label="Input your password"
            :disabled="isLoading"
          >
          </v-text-field>
          <v-progress-linear
            v-if="isLoading"
            indeterminate
            color="primary"
          ></v-progress-linear>
          <div class="">
            <v-btn
              depressed
              color="primary"
              large
              width="100%"
              @click="onSubmit"
              :disabled="!password || isLoading"
            >
              Close
            </v-btn>
          </div>
        </div>
      </div>
      <div class="ml-10 mr-10">
        <v-alert v-if="error" dense text type="error">
          {{ error }}
        </v-alert>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
/* eslint-disable */
import { mapState, mapMutations } from "vuex";
import { startApp } from "@/lib/metamask";
import { getBalanceETH, getBalanceDAI } from "@/lib/metamask/wallet.js";
import localStorage from "@/lib/local-storage"

export default {
  name: "WalletBinding",
  props: {
    show: Boolean,
  },
  data: () => ({
    password: "",
    isLoading: false,
    error: "",
    putWallet: true,
    putAccount: false,
    loading: false,
    ethAccount: null,
    accountList: [],
    inputPassword: false,
    selectAccount: null,
  }),
  computed: {
    _show: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit("toggle", val);
      },
    },
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      metamaskWalletAddress: (state) => state.metamask.metamaskWalletAddress,
    }),
  },
  watch: {
    show(val) {
      if (val) {
        this.password = "";
        this.error = "";
        this.loading = false;
        this.putAccount = false;
        this.putWallet = true;
        this.inputPassword = false;
        this.isLoading = false;
      }
    },
  },
  mounted() {},
  methods: {
    ...mapMutations({
      setMetamaskAddress: "metamask/SET_WALLET_ADDRESS",
    }),

    async setWalllet(walletName) {
      this.error = "";
      this.loading = true;
      switch (walletName) {
        case "metamask":
          this.ethAccount = await startApp();
          if (this.ethAccount.currentAccount == "no_install") {
            this.error = "Please install MetaMask!";
          } else {
            this.accountList = [];
            for (let x = 0; x < this.ethAccount.accountList.length; x++) {
              const balance = await getBalanceDAI(
                this.ethAccount.accountList[x]
              );
              var lastAddr = this.ethAccount.accountList[x].substr(
                this.ethAccount.accountList[x].length - 4
              );
              let isActive = false;
              if (
                this.metamaskWalletAddress == this.ethAccount.accountList[x]
              ) {
                isActive = true;
              }
              this.accountList.push({
                address: this.ethAccount.accountList[x],
                lastAddr: lastAddr,
                name: "Account " + (x + 1),
                balance: parseFloat(balance).toFixed(2),
                active: isActive,
              });
            }
            
            this.putWallet = false;
            this.putAccount = true;
          }
          break;
      }
      this.loading = false;
    },
    async setAccount(account) {
      this.selectAccount = account;
      this.putAccount = false;
      if (this.wallet.isLocked) {
        this.inputPassword = true;
      } else {
        this.onSubmit();
      }
    },
    async onSubmit() {
      this.isLoading = true;
      this.error = "";
      try {
        if (this.wallet.isLocked) {
          await this.wallet.decodePkcs8(this.password);
        }

        const accountId = localStorage.getAddress();
        const ethAddress = this.selectAccount.address

        await this.$store.dispatch("wallet/walletBinding", {accountId, ethAddress});
        this.setMetamaskAddress(this.selectAccount.address);
        this.$emit("status-wallet", {
          status: true,
          img: "metamask-account-connected.png",
        });
        this.isLoading = false;
        this.closeDialog();
      } catch (err) {
        console.log(err.message);
        this.isLoading = false;
        this.password = "";
        this.error = err.message;
      }
    },
    closeDialog() {
      this._show = false;
      this.password = "";
      this.error = "";
      this.loading = false;
      this.putAccount = false;
      this.putWallet = true;
      this.inputPassword = false;
    },
  },
};
</script>