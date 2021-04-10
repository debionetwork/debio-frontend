<template>
  <v-app>
    <v-app-bar app flat color="transparent" dense>
      <v-spacer></v-spacer>
      <SettingsMenu />
      <DevMenu v-if="isDevEnv"/>
    </v-app-bar>
    <v-main class="login-main">
      <div class="d-flex justify-center">
        <a href="https://www.degenics.com/" target="_blank">
          <v-img src="@/assets/degenics-logo.png" max-width="150px" />
        </a>
      </div>
      <AboutUs />
      <v-container>
          <v-card class="pb-7 pt-2 mt-10" style="max-width: 400px; margin: 0 auto; border-radius: 30px;">
            <v-row class="mt-0">
              <v-col cols="12">
                <div class="text-h5 ml-10 grey--text text--darken-2 align-middle">
                  <v-icon
                    :color="hover ? 'primary' : ''"
                    :size="48"
                  >
                    mdi-account-supervisor
                  </v-icon>
                  <b class="ml-2">Customers</b>
                </div>
              </v-col>
            </v-row>
            <div class="d-flex justify-center mt-4">
              <div class="d-flex flex-column" style="min-width: 320px; max-width: 400px;">
                <v-btn
                    color="primary"
                    class="mb-5"
                    block
                    large>Log in</v-btn>
                <v-btn
                    color="primary"
                    block
                    outlined
                    large>Register</v-btn>
              </div>
            </div>
          </v-card>
          <v-card class="pb-7 pt-2 mt-10 mb-10" style="max-width: 400px; margin: 0 auto; border-radius: 30px;">
            <v-row class="mt-0">
              <v-col cols="12">
                <div class="text-h5 ml-10 grey--text text--darken-2 align-middle">
                  <v-icon
                    :color="hover ? 'primary' : ''"
                    :size="48"
                  >
                    mdi-microscope
                  </v-icon>
                  <b class="ml-2">Labs</b>
                </div>
              </v-col>
            </v-row>
            <div class="d-flex justify-center mt-4">
              <div class="d-flex flex-column" style="min-width: 320px; max-width: 400px;">
                <v-btn
                    color="secondary"
                    class="mb-5"
                    block
                    large>Log in</v-btn>
                <v-btn
                    color="secondary"
                    block
                    outlined
                    large>Register</v-btn>
              </div>
            </div>
          </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'
import DevMenu from '@/components/DevMenu'
import SettingsMenu from '@/components/SettingsMenu'
import AboutUs from '../../../Login/AboutUs'

export default {
  name: 'Register',
  components: {
    DevMenu,
    SettingsMenu,
    AboutUs
  },
  computed: {
    isDevEnv() {
      return process.env.NODE_ENV == 'development'
    }
  },
  data: () => ({
    generateAccountDialog: false,
    accessAccountMnemonicDialog: false,
    importKeystoreDialog: false,
    usePrivateKeyDialog: false,
    setKeystorePasswordDialog: false,
    secretType: '', // mnemonic or privateKey
    secret: '', // mnemonic or privateKey string
  }),
  methods: {
    ...mapActions({
      generateMnemonic: 'ethereum/generateMnemonic'
    }),
    onGenerateAccount() {
      this.generateAccountDialog = true
    },
    onUseMnemonic() {
      this.accessAccountMnemonicDialog = true
    },
    onImportKeystore() {
      this.importKeystoreDialog = true
    },
    onUsePrivateKey() {
      this.usePrivateKeyDialog = true
    },
    setKeyStorePassword(previousDialog, secretType, secret) {
      this.secretType = secretType // mnemonic or privateKey
      this.secret = secret // mnemonic or privateKey string
      this[previousDialog] = false // Hide previous dialog
      this.setKeystorePasswordDialog = true
    },
    clearSecret() {
      this.secretType = ''
      this.secret = ''
    }
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
