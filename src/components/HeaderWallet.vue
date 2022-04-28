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
              @click="handleCopy(polkadotAddress, 'polkadot')"
            >
              <div>
                <v-img src="@/assets/copy-icon.svg" />
              </div>
            </v-btn>
          </div>
          <div class="text-content">Balance</div>
          <div class="d-flex">
            <div class="wallet-icon">
              <v-img src="@/assets/debio-logo.png" />
            </div>
            <strong class="notification-subtitle">{{ balance }} DBIO</strong>
          </div>
        </div>
        <div class="divider"></div>
        <div>
          <div class="d-flex justify-space-between">
            <div class="d-flex">
              <div class="wallet-icon">
                <v-img src="@/assets/metamask-icon.svg" />
              </div>
              <strong class="notification-subtitle">Metamask</strong>
            </div>
            <div class="disconnect-text" v-if="metamaskAddress" @click="disconnectWallet">Disconnect</div>
          </div>
          <div v-if="metamaskAddress">
            <div class="text-content">Address</div>
            <div class="d-flex justify-space-between address-wrapper">
              <div class="address-text">
                {{ metamaskAddress.substring(0, 25) }}..
              </div>
              <v-btn
                class="ma-2"
                text
                icon
                color="#5640A5"
                small
                @click="handleCopy(metamaskAddress, 'metamask')"
              >
                <div>
                  <v-img src="@/assets/copy-icon.svg" />
                </div>
              </v-btn>
            </div>
            <div class="text-content">Balance</div>
            <div class="d-flex">
              <div class="wallet-icon">
                <v-img src="@/assets/dai-icon.svg" />
              </div>
              <strong class="notification-subtitle"
                >{{ Number(metamaskBalance).toFixed(3) }} DAI</strong
              >
            </div>
          </div>
          <div v-else>
            <div class="text-content">
              Wallet not found, Connect Wallet to bind your Metamask wallet to
              your account
            </div>
            <Button class="btn-connect-wallet" @click="openWalletBinding">CONNECT WALLET</Button>
          </div>
        </div>
      </v-card>
    </div>
  </v-menu>
</template>

<script>
import {mapState, mapMutations, mapActions} from "vuex"
import {ethAddressByAccountId} from "@/lib/polkadotProvider/query/userProfile"
import {queryBalance} from "@/lib/polkadotProvider/query/balance"
import {getBalanceDAI} from "@/lib/metamask/wallet.js"
import {fromEther} from "@/lib/balance-format"
import Button from "@/components/Button"

export default {
  name: "HeaderUserInfo",
  computed: {
    ...mapState({
      walletBalance: (state) => state.substrate.walletBalance,
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      metamaskWalletAddress: (state) => state.metamask.metamaskWalletAddress,
      metamaskWalletBalance: (state) => state.metamask.metamaskWalletBalance
    })
  },
  data: () => ({
    balance: 0,
    polkadotAddress: "",
    metamaskAddress: "",
    metamaskBalance: 0
  }),

  components: {
    Button
  },

  methods: {
    ...mapMutations({
      setWalletBalance: "substrate/SET_WALLET_BALANCE",
      clearWallet: "metamask/CLEAR_WALLET",
      setMetamaskAddress: "metamask/SET_WALLET_ADDRESS",
      setMetamaskBalance: "metamask/SET_WALLET_BALANCE"
    }),

    ...mapActions({
      clearAuth: "auth/clearAuth"
    }),

    async getBalance(balanceNummber) {
      const balance = Number(await fromEther(balanceNummber)).toFixed(3)
      this.balance = balance.replace(/\.000/, "")
      if (this.balance == "0") {
        this.balance = "0"
      }
    },

    async fetchWalletBalance() {
      try {
        const balanceNummber = await queryBalance(this.api, this.wallet.address)
        this.getBalance(balanceNummber)
        this.setWalletBalance(balanceNummber)
      } catch (err) {
        console.error(err)
      }
    },

    openWalletBinding() {
      this.$emit("showWalletBinding", true)
    },

    async checkMetamaskBalance() {
      this.metamaskAddress = this.metamaskWalletAddress
      let address = ""
      if (this.metamaskWalletAddress == "") {
        const ethRegisterAddress = await ethAddressByAccountId(
          this.api,
          this.wallet.address
        )
        address = ethRegisterAddress
      } else {
        address = this.metamaskWalletAddress
      }

      if (address != "") {
        const balance = await getBalanceDAI(address)

        this.setMetamaskBalance(balance)
        this.metamaskBalance = balance
      }
    },

    handleCopy(text, wallet) {
      navigator.clipboard.writeText(text)

      if (wallet === "polkadot") {
        this.polkadotAddress = "Address Copied!"
        setTimeout(() => {
          this.polkadotAddress = text
        }, 1000)
      } else if (wallet === "metamask") {
        this.metamaskAddress = "Address Copied!"
        setTimeout(() => {
          this.metamaskAddress = text
        }, 1000)
      }
    },

    disconnectWallet() {
      this.metamaskAddress = ""
      this.clearWallet()
    }
  },

  watch: {
    async wallet() {
      await this.fetchWalletBalance()
    },

    walletBalance() {
      this.getBalance(this.walletBalance)
    },

    metamaskWalletAddress() {
      this.checkMetamaskBalance()
    }
  },

  async mounted() {
    this.polkadotAddress = this.wallet.address

    await this.fetchWalletBalance()

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
