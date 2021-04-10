<template>
  <v-app>
    <v-app-bar app flat color="transparent" dense>
      <v-spacer></v-spacer>
      <SettingsMenu />
      <DevMenu v-if="isDevEnv"/>
    </v-app-bar>
    <v-main class="login-main">
      <div class="d-flex justify-center">
        <!-- <a href="https://www.degenics.com/" target="_blank"> -->
          <v-img src="@/assets/degenics-logo-words.png" max-width="300"/>
        <!-- </a> -->
      </div>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="5" sm="8">
            <Card>
              <template v-slot:title_icon>
                <v-icon color="#373737">mdi-account-multiple</v-icon>
              </template>
              <template v-slot:title>
                Customers
              </template>

              <template v-slot:text>
                <div class="mb-3">
                  <Button color="primary" @click="onLogin('customer')">
                    Login
                  </Button>
                </div>
                <div class="mb-3">
                  <Button color="primary" outlined @click="onGenerateAccount('customer')">
                    Generate Account
                  </Button>
                </div>
              </template>
            </Card>
          </v-col>
        </v-row>

        <v-row justify="center">
          <v-col cols="12" md="5" sm="8">
            <Card>
              <template v-slot:title_icon>
                <v-icon color="#373737">mdi-microscope</v-icon>
              </template>
              <template v-slot:title>
                Labs
              </template>

              <template v-slot:text>
                <div class="mb-3">
                  <Button color="secondary" @click="onLogin('lab')">
                    Login
                  </Button>
                </div>
                <div class="mb-3">
                  <Button color="secondary" outlined @click="onGenerateAccount('lab')">
                    Generate Account
                  </Button>
                </div>
              </template>
            </Card>
          </v-col>
        </v-row>
      </v-container>

      <GenerateAccountDialog
        :show="generateAccountDialog"
        :role="role"
        @toggle="generateAccountDialog = $event"
        @mnemonic-generated="({ mnemonic, role }) => onAccountGenerated(mnemonic, role)"
      ></GenerateAccountDialog>
      <AccessAccountMnemonicDialog
        :show="accessAccountMnemonicDialog"
        :role="role"
        @toggle="accessAccountMnemonicDialog = $event"
        @mnemonic-input="({ mnemonic, role }) => onMnemonicValidated(mnemonic, role)"
      ></AccessAccountMnemonicDialog>
    </v-main>
  </v-app>
</template>

<script>
import { mapMutations } from 'vuex'
import Card from '@/components/Card'
import DevMenu from '../../components/DevMenu'
import SettingsMenu from '../../components/SettingsMenu'
import GenerateAccountDialog from './GenerateAccountDialog'
import AccessAccountMnemonicDialog from './AccessAccountMnemonicDialog'
import Button from '@/components/Button'
import { Wallet } from '@/lib/substrate'
import localStorage from '@/lib/local-storage'

export default {
  name: 'Home',
  components: {
    Card,
    DevMenu,
    SettingsMenu,
    GenerateAccountDialog,
    AccessAccountMnemonicDialog,
    Button,
  },
  computed: {
    isDevEnv() {
      return process.env.NODE_ENV == 'development'
    }
  },
  data: () => ({
    generateAccountDialog: false,
    accessAccountMnemonicDialog: false,
    setKeystorePasswordDialog: false,
    role: '',
  }),
  methods: {
    ...mapMutations({
      setWallet: 'substrate/SET_WALLET'
    }),
    onGenerateAccount(role) {
      this.role = role
      this.generateAccountDialog = true
    },
    onLogin(role) {
      this.role = role
      this.accessAccountMnemonicDialog = true
    },
    onAccountGenerated(mnemonic, role) {
      const wallet = new Wallet(mnemonic)
      if (role == 'lab') {
        // TODO: if role is lab, registerLab in blockchain
        role
      }
      this.setWallet(wallet)
      localStorage.setWallet(JSON.stringify(wallet))
      this.$router.push('/')
    },
    onMnemonicValidated(mnemonic, role) {
      const wallet = new Wallet(mnemonic)
      if (role == 'lab') {
        // TODO: if role is lab, check if address is registered as lab in blockchain
        role
      }
      this.setWallet(wallet)
      localStorage.setWallet(JSON.stringify(wallet))
      this.$router.push('/')
    },
  }
}
</script>

<style lang="scss" scoped>
.login-main {
  background: rgba(0,0,0, 0.5);
  background: linear-gradient(25deg, rgba(0,0,0,1) 0%, rgba(63,32,64,1) 24%, rgba(253,192,255,1) 74%, rgba(255,255,255,1) 96%);
}
.card-hover {
  border: 1px solid rgba(63,32,64,0.5);
}
</style>
