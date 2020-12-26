<template>
  <v-app>
    <v-app-bar app flat color="transparent" dense>
      <v-spacer></v-spacer>
      <DevMenu />
    </v-app-bar>
    <v-main class="login-main">
      <v-container>

          <v-card class="py-10 mt-10" style="max-width: 400px; margin: 0 auto; border-radius: 30px;">
            <div class="d-flex justify-center">
              <v-img
                src="@/assets/degenics-logo.webp"
                max-width="150px"
              />
            </div>
            <v-row class="mt-4">
              <v-col cols="12">
                <div class="text-h4 text-center grey--text text--darken-2">
                  <b>Access Account</b>
                </div>
              </v-col>
            </v-row>
            <div class="d-flex justify-center mt-4">
              <div class="d-flex flex-column" style="min-width: 320px; max-width: 400px;">
                <v-hover v-slot="{ hover }">
                  <v-card
                    class="my-1"
                    :class="{ 'card-hover': hover }"
                    @click="onGenerateAccount"
                    outlined
                    :style="'border-radius: 10px;'"
                  >
                    <div class="d-flex align-center">
                      <div class="my-3 ml-5">
                        <v-icon
                          :color="hover ? 'primary' : ''"
                          :size="48"
                        >
                          mdi-key-chain
                        </v-icon>
                      </div>
                      <div class="my-3 ml-10 text-center" :class="hover ? 'primary--text' : ''">
                        Generate Account
                      </div>
                    </div>
                  </v-card>
                </v-hover>

                <v-hover v-slot="{ hover }">
                  <v-card
                    class="my-1"
                    :class="{ 'card-hover': hover }"
                    @click="onUseMnemonic"
                    outlined
                    style="border-radius: 10px;"
                  >
                    <div class="d-flex align-center">
                      <div class="my-3 ml-5">
                        <v-icon
                          :color="hover ? 'primary' : ''"
                          :size="48"
                        >
                          mdi-script-text
                        </v-icon>
                      </div>
                      <div class="my-3 ml-10 text-center" :class="hover ? 'primary--text' : ''">
                        Use Mnemonic Phrase
                      </div>
                    </div>
                  </v-card>
                </v-hover>

                <v-hover v-slot="{ hover }">
                  <v-card
                    class="my-1"
                    :class="{ 'card-hover': hover }"
                    outlined
                    style="border-radius: 10px;"
                  >
                    <div class="d-flex align-center">
                      <div class="my-3 ml-5">
                        <v-icon
                          :color="hover ? 'primary' : ''"
                          :size="48"
                        >
                          mdi-key-chain
                        </v-icon>
                      </div>
                      <div class="my-3 ml-10 text-center" :class="hover ? 'primary--text' : ''">
                        Import JSON Keystore
                      </div>
                    </div>
                  </v-card>
                </v-hover>
              </div>
            </div>
          </v-card>

      </v-container>
      <GenerateAccountDialog
        :show="generateAccountDialog"
        @toggle="generateAccountDialog = $event"
        @mnemonic-generated="setKeyStorePassword('generateAccountDialog')"
      ></GenerateAccountDialog>
      <AccessAccountMnemonicDialog
        :show="accessAccountMnemonicDialog"
        @toggle="accessAccountMnemonicDialog = $event"
        @mnemonic-imported="setKeyStorePassword('accessAccountMnemonicDialog')"
      ></AccessAccountMnemonicDialog>
      <SetKeyStorePasswordDialog
        :show="setKeyStorePasswordDialog"
        @toggle="setKeyStorePasswordDialog = $event"
      ></SetKeyStorePasswordDialog>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'
import DevMenu from '../../components/DevMenu'
import GenerateAccountDialog from './GenerateAccountDialog'
import AccessAccountMnemonicDialog from './AccessAccountMnemonicDialog'
import SetKeyStorePasswordDialog from './SetKeyStorePasswordDialog'

export default {
  name: 'Home',
  components: {
    DevMenu,
    GenerateAccountDialog,
    AccessAccountMnemonicDialog,
    SetKeyStorePasswordDialog,
  },
  data: () => ({
    generateAccountDialog: false,
    accessAccountMnemonicDialog: false,
    setKeyStorePasswordDialog: false,
  }),
  methods: {
    ...mapActions({
      generateMnemonic: 'ethereum/generateMnemonic'
    }),
    onGenerateAccount() {
      // Mnemonic will be shown in <GenerateAccountDialog />
      this.generateMnemonic()
      this.generateAccountDialog = true
    },
    onUseMnemonic() {
      this.accessAccountMnemonicDialog = true
    },
    setKeyStorePassword(previousDialog) {
      this[previousDialog] = false // Hide previous dialog
      this.setKeyStorePasswordDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
.login-main {
  background: rgb(0,0,0);
  background: linear-gradient(25deg, rgba(0,0,0,1) 0%, rgba(63,32,64,1) 24%, rgba(253,192,255,1) 74%, rgba(255,255,255,1) 96%);
}
.card-hover {
  border: 1px solid rgba(63,32,64,0.5);
}
</style>
