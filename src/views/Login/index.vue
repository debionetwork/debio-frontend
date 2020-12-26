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
                <RectangleCardIconBtn
                  icon="mdi-key-chain"
                  text="Generate Account"
                  @click="onGenerateAccount"
                ></RectangleCardIconBtn>

                <RectangleCardIconBtn
                  icon="mdi-script-text"
                  text="Use Mnemonic Phrase"
                  @click="onUseMnemonic"
                ></RectangleCardIconBtn>

                <RectangleCardIconBtn
                  icon="mdi-file-key"
                  text="Import JSON Keystore"
                  @click="onImportKeystore"
                ></RectangleCardIconBtn>

                <RectangleCardIconBtn
                  icon="mdi-key-variant"
                  text="Private Key"
                  @click="onUsePrivateKey"
                ></RectangleCardIconBtn>
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
      <ImportKeystoreDialog
        :show="importKeystoreDialog"
        @toggle="importKeystoreDialog = $event"
      ></ImportKeystoreDialog>
      <UsePrivateKeyDialog
        :show="usePrivateKeyDialog"
        @toggle="usePrivateKeyDialog = $event"
        @private-key-imported="setKeyStorePassword('usePrivateKeyDialog')"
      ></UsePrivateKeyDialog>
      <SetKeystorePasswordDialog
        :show="setKeystorePasswordDialog"
        @toggle="setKeystorePasswordDialog = $event"
      ></SetKeystorePasswordDialog>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'
import DevMenu from '../../components/DevMenu'
import RectangleCardIconBtn from '../../components/RectangleCardIconBtn'
import GenerateAccountDialog from './GenerateAccountDialog'
import AccessAccountMnemonicDialog from './AccessAccountMnemonicDialog'
import ImportKeystoreDialog from './ImportKeystoreDialog'
import UsePrivateKeyDialog from './UsePrivateKeyDialog'
import SetKeystorePasswordDialog from './SetKeystorePasswordDialog'

export default {
  name: 'Home',
  components: {
    DevMenu,
    RectangleCardIconBtn,
    GenerateAccountDialog,
    AccessAccountMnemonicDialog,
    ImportKeystoreDialog,
    UsePrivateKeyDialog,
    SetKeystorePasswordDialog,
  },
  data: () => ({
    generateAccountDialog: false,
    accessAccountMnemonicDialog: false,
    importKeystoreDialog: false,
    usePrivateKeyDialog: false,
    setKeystorePasswordDialog: false,
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
    onImportKeystore() {
      this.importKeystoreDialog = true
    },
    onUsePrivateKey() {
      this.usePrivateKeyDialog = true
    },
    setKeyStorePassword(previousDialog) {
      this[previousDialog] = false // Hide previous dialog
      this.setKeystorePasswordDialog = true
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
