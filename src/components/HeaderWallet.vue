<template>
  <v-menu bottom left :close-on-content-click="false">
    <template v-slot:activator="{on, attrs}">
      <div class="d-flex align-center ml-10 mr-4" v-bind="attrs" v-on="on">
        <div class="d-flex align-center">
          <div style="cursor: pointer">
            <v-icon>mdi-wallet</v-icon>
          </div>
        </div>
      </div>
    </template>
    <div class="mt-11">
      <v-card class="card-container">
        <div>
          <strong class="notification-title">Wallet</strong>
          <div class="d-flex">
            <div class="wallet-icon">
              <v-img src="@/assets/polkadot-icon.svg" />
            </div>
            <strong class="notification-subtitle">Polkadot</strong>
          </div>
          <div class="text-content">Address</div>
          <div class="d-flex justify-space-between address-wrapper">
            <div class="address-text">
              {{ polkadotAddress.substring(0, 25) }}..
            </div>
            <v-btn
              class="ma-2"
              text
              icon
              color="#5640A5"
              small
              @click="handleCopy(polkadotAddress)"
            >
              <div>
                <v-img src="@/assets/copy-icon.svg" />
              </div>
            </v-btn>
          </div>
          <div class="text-content">Balance</div>
          <div class="d-flex" v-for="wallet in polkadotWallets" :key="wallet.id">
            <div class="wallet-icon">
              <v-img
                alt="no-list-data"
                :src="require(`../assets/${wallet.icon}.svg`)"
                max-width="24px"
                max-height="24px"
              />
            </div>
            <strong class="notification-subtitle">{{ wallet.balance }}  {{ wallet.currency }}</strong>
          </div>
        </div>
        <div class="divider"></div>
      </v-card>
    </div>
  </v-menu>
</template>

<script>
import {mapState, mapMutations, mapActions} from "vuex"
import {queryBalance} from "@/lib/polkadotProvider/query/balance"
import {fromEther} from "@/lib/balance-format"

import localStorage from "@/lib/local-storage"
import { queryGetAssetBalance, queryGetAllOctopusAssets } from "@/lib/polkadotProvider/query/octopus-assets"

export default {
  name: "HeaderUserInfo",
  computed: {
    ...mapState({
      walletBalance: (state) => state.substrate.walletBalance,
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      lastEventData: (state) => state.substrate.lastEventData
    })
  },
  data: () => ({
    balance: 0,
    polkadotAddress: "",
    ethRegisterAddress: null,
    polkadotWallets: [
      {
        id: 0,
        name: "debio",
        icon: "debio-logo",
        currency: "DBIO",
        unit: "ether",
        balance: 0
      },

      {
        name: "usdn",
        icon: "near-logo",
        currency: "USN",
        unit: "ether",
        balance: 0
      },

      {
        name: "usdt",
        icon: "tether-logo",
        currency: "USDT",
        unit: "mwei",
        balance: 0
      }
    ],
    isConnected: false,
    octopusAsset: []
  }),

  methods: {
    ...mapMutations({
      setWalletBalance: "substrate/SET_WALLET_BALANCE",
      setUSNBalance: "substrate/SET_USN_BALANCE",
      setUSDTBalance: "substrate/SET_USDT_BALANCE",
      clearWallet: "metamask/CLEAR_WALLET"
    }),

    ...mapActions({
      clearAuth: "auth/clearAuth"
    }),

    async getBalance(balanceNumber) {
      const balance = Number(await fromEther(balanceNumber, "DBIO")).toFixed(3)
      this.balance = balance.replace(/\.000/, "")
      if (this.balance == "0") {
        this.balance = "0"
      }
    },

    async fetchWalletBalance() {
      try {
        const balanceNumber = await queryBalance(this.api, this.wallet.address)
        console.log("Balance", balanceNumber)
        this.getBalance(balanceNumber)
        this.setWalletBalance(balanceNumber)

      } catch (err) {
        console.error(err)
      }
    },

    async getOctopusAssets() {
      const assets = await queryGetAllOctopusAssets(this.api)
      for (let i = 0; i < assets.length; i++) {
        const name = assets[i][0].toHuman()[0]
        const id = assets[i][1].toHuman()
        const data = await queryGetAssetBalance(this.api, id, this.wallet.address)
        const assetData = {id, data, name:  name.split(".")[0]}
        this.octopusAsset.push(assetData)
      }
    },
    
    async fetchPolkadotBallance() {  
      this.polkadotWallets.forEach(async (wallet) => {
        console.log(wallet)
        if (wallet.name !== "debio") {
          const data = this.octopusAsset.find(a => a.name === wallet.name)
          if (!data) return
          wallet.balance = this.web3.utils.fromWei(data.data.balance.replaceAll(",", ""), wallet.unit)
          wallet.id = data.id
          if (wallet.name === "usdn") this.setUSNBalance(wallet.balance)
          if (wallet.name === "usdt") this.setUSDTBalance(wallet.balance)
        }
      })
      this.setPolkadotWallet(this.polkadotWallets)
    },

    openWalletBinding() {
      this.$emit("showWalletBinding", true)
    },

    async checkMetamask() {
      const ethAddress = localStorage.getWalletAddress()
      this.isConnected = false

      if (ethAddress) {
        this.isConnected = true
      }
    },

    handleCopy(text) {
      navigator.clipboard.writeText(text)
      this.polkadotAddress = "Address Copied!"
      setTimeout(() => {
        this.polkadotAddress = text
      }, 1000)
    }
  },

  watch: {
    lastEventData() {
      if(this.lastEventData) {
        this.fetchWalletBalance()
        this.fetchPolkadotBallance()
      }
    }
  },

  async mounted() {
    this.polkadotAddress = this.wallet.address
    await this.fetchWalletBalance()
    await this.fetchPolkadotBallance()

    if (this.metamaskWalletAddress) await this.checkMetamaskBalance()
  }
}
</script>

<style>
.card-container {
  width: 328px;
  padding: 10px;
}

.wallet-icon {
  width: 14px;
  margin: 12px 0px 0px 10px;
}

.notification-title {
  font-size: 16px;
  display: block;
  padding: 10px 3px 7px 3px;
  margin-bottom: 10px;
  border-bottom: 1px solid #e9e9e9;
}

.notification-subtitle {
  font-size: 14px;
  display: block;
  padding: 10px 3px 7px 3px;
  margin: 0 7px 0 7px;
  color: #595959;
}

.text-content {
  font-size: 12px;
  color: #8c8c8c;
  margin: 10px 10px 0px 10px;
}

.address-wrapper {
  background-color: #f5f5f5;
  color: #757274 !important;
  margin: 0px 10px 0px 10px;
  border-radius: 5px;
  padding: 0 8px;
}

.address-text {
  margin: auto 0px;
  font-size: 14px;
}

.disconnect-text {
  font-size: 12px;
  display: block;
  cursor: pointer;
  padding: 10px 3px 7px 3px;
  margin: 0 7px 0 7px;
  color: #f60689;
}

.btn-connect-wallet {
  width: auto !important;
  margin: 15px 10px 15px 10px;
}

.divider {
  border-bottom: 1px solid #e9e9e9;
  margin: 15px 10px 15px 10px;
}
</style>
