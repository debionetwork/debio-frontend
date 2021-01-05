<template>
  <v-menu
    bottom
    left
    :close-on-content-click="false"
    v-model="show"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :dark="dark"
        icon
        v-bind="attrs"
        @click.stop="(onMenuToggle(on))"
      >
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </template>

    <v-card width="500" class="px-2">
      <v-list>
        <v-list-item>
          <v-list-item-action>
            <v-icon v-if="isRpcConnected" color="green">mdi-check-circle</v-icon>
            <v-progress-circular
              v-else-if="isLoading"
              :size="20"
              color="grey"
              indeterminate
            ></v-progress-circular>
            <v-icon v-else color="red">mdi-wifi-cancel</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            {{ isLoading ? 'Connecting' : isRpcConnected ? 'Connected to network' : 'Disconnected' }}
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-text-field
              outlined
              auto-grow
              v-model="rpcUrlInput"
              label="RPC URL"
              hide-details="auto"
            >
            </v-text-field>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-progress-linear
        v-if="isLoading"
        indeterminate
        color="primary"
      ></v-progress-linear>
      <v-card-actions class="px-4 pb-4">
        <v-btn
          depressed
          color="primary"
          large
          width="100%"
          @click="onApplySettings"
          :disabled="isLoading"
          :loading="isLoading"
        >
          Set Connection
          <template v-slot:loader>
            <span>Connecting</span>
          </template>
        </v-btn>
      </v-card-actions>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            Gas Config
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-text-field
              outlined
              auto-grow
              v-model="gasPriceInput"
              label="Gas Price (Wei)"
              hide-details="auto"
            >
            </v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-text-field
              outlined
              auto-grow
              v-model="gasLimitInput"
              label="Gas Limit (Wei)"
              hide-details="auto"
            >
            </v-text-field>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-card-actions class="px-4 pb-4">
        <v-btn
          depressed
          color="primary"
          large
          width="100%"
          @click="onSetGasConfig"
          :disabled="!gasLimitInput || !gasPriceInput"
        >
          {{ justSetConfig ? 'Gas Config Set' : 'Set Gas Config' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import localStorage from '../lib/local-storage'
import appConfig from '../lib/app-config'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'SettingsMenu',
  props: {
    dark: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    show: false,
    rpcUrlInput: '',
    gasPriceInput: '',
    gasLimitInput: '',
    justSetConfig: false,
  }),
  computed: {
    ...mapState({
      isLoading: state => state.ethereum.isLoading,
      web3: state => state.ethereum.web3
    }),
    isRpcConnected() {
      return !!this.web3
    }
  },
  mounted() {
    const savedRpcUrl = localStorage.getRpcUrl()
    if (savedRpcUrl) {
      this.rpcUrlInput = savedRpcUrl
    }
  },
  watch: {
    show(isShow) {
      if (isShow) {
        const savedRpcUrl = localStorage.getRpcUrl()
        if (savedRpcUrl) {
          this.rpcUrlInput = savedRpcUrl
        }
        this.justSetConfig = false
        this.gasPriceInput = appConfig.getGasPrice()
        this.gasLimitInput = appConfig.getGasLimit()
      }
    }
  },
  methods: {
    onMenuToggle() {
      this.show = !this.show
    },
    ...mapActions({
      initWeb3: 'ethereum/initWeb3'
    }),
    async onApplySettings() {
      const result = await this.initWeb3(this.rpcUrlInput)
      if (result.success) {
        localStorage.setRpcUrl(this.rpcUrlInput)
      }
    },
    onSetGasConfig() {
      appConfig.setGasPrice(this.gasPriceInput)
      appConfig.setGasLimit(this.gasLimitInput)
      this.justSetConfig = true
    }
  }
}
</script>

<style>

</style>
