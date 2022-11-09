<template>
  <v-dialog :value="show" width="440" persistent>
    <v-card>
      <div align="right">
        <v-btn icon @click="closeDialog" class="pr-2 pt-2">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <div class="px-5">
        <div align="center" class="pt-5 pb-8">
          <strong>Stake Onboarding</strong>
        </div>
        <div class="pb-5 px-5">
          <ol>
            <li class="pb-5">
              You need to stake DBIO to activate your account. There’s no
              locking period. Your fund can be unstaked anytime with your
              consent but there will be a period of 6 days to process it.
            </li>
            <li class="pb-5">
              By Unstaking your fund, you will be an inactive users.
            </li>
            <li class="pb-5">
              On the condition that your verification is rejected, your fund
              will be refunded.
            </li>
          </ol>
        </div>
        <div class="d-flex justify-space-between mb-3">
          <div><strong>Staking Amount</strong></div>
          <div><strong>{{ stakeAmount }} DBIO</strong></div>
        </div>
        <div style="color: #F5222D" class="mb-3" v-if="!computeBalance">
          <strong>Insufficient Balance</strong>
        </div>
        <div class="d-flex justify-space-between">
          <div class="mb-5">
            <span style="font-size: 12px"> Estimated Transaction Weight </span>
            <v-tooltip bottom>
              <template v-slot:activator="{on, attrs}">
                <v-icon color="primary" size="14" v-bind="attrs" v-on="on">
                  mdi-alert-circle-outline
                </v-icon>
              </template>
              <span style="font-size: 10px;"
                >Total fee paid in DBIO to execute this transaction.</span
              >
            </v-tooltip>
          </div>
          <span style="font-size: 12px;">
            {{ Number(fee).toFixed(4) }} DBIO
          </span>
        </div>
        <Button
          @click="handleSubmit"
          elevation="2"
          block
          class="mb-5"
          :loading="loading"
          :disabled="!computeBalance"
          :style="!computeBalance ? 'background-color: #c7c7c7 !important; cursor: default;' : ''"
        >
          Stake
        </Button>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters, mapState} from "vuex"
import Button from "@/components/Button"
import {stakeLabFee} from "@/lib/polkadotProvider/command/labs"
import {queryBalance} from "@/lib/polkadotProvider/query/balance"
import {minimumStakeAmount} from "@/lib/polkadotProvider/query/labs"
import { toEther } from "@/lib/balance-format"

export default {
  name: "DialogStake",

  components: {
    Button
  },

  computed: {
    ...mapState({
      web3: (state) => state.metamask.web3,
      wallet: (state) => state.substrate.wallet
    }),

    ...mapGetters({
      api: "substrate/getAPI",
      pair: "substrate/wallet"
    }),

    computeBalance() {
      return this.balance > this.minimumStake
    }
  },

  props: {
    show: Boolean,
    loading: Boolean
  },

  data: () => ({
    fee: 0,
    balance: 0,
    minimumStake: 0,
    stakeAmount: ""
  }),

  async mounted() {
    await this.getStakeFee()
    await this.fetchWalletBalance()
    await this.getMinimumStake()
  },

  methods: {
    closeDialog() {
      this.$emit("close")
    },

    handleSubmit() {
      this.$emit("submit")
    },

    async getMinimumStake() {
      const stakeAmount = await minimumStakeAmount(this.api)
      const _minimumStakeAmount = Number(stakeAmount.replaceAll(",", ""))

      this.minimumStake = stakeAmount ? (_minimumStakeAmount / (10**18)) : toEther(50000, "DBIO")
      this.stakeAmount = new Intl.NumberFormat("en-US").format(_minimumStakeAmount / (10**18))
    },

    async fetchWalletBalance() {
      try {
        const balance = await queryBalance(this.api, this.wallet.address)

        this.balance = balance
      } catch (err) {
        console.error(err)
      }
    },

    async getStakeFee() {
      try {
        const fee = await stakeLabFee(this.api, this.pair)
        
        this.fee = Number(
          this.web3.utils.fromWei(String(fee.partialFee), "ether")
        )
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style></style>
