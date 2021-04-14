<template>
  <v-app>
    <v-app-bar app flat color="transparent" dense>
      <v-spacer></v-spacer>
      <SettingsMenu />
      <DevMenu v-if="isDevEnv" />
    </v-app-bar>
    <v-main class="login-main">
      <div class="d-flex justify-center">
        <!-- <a href="https://www.degenics.com/" target="_blank"> -->
        <v-img src="@/assets/debio-logo.png" max-width="150" />
        <!-- </a> -->
      </div>
      <v-container>

        <v-row justify="center" style="margin: 0 auto;">
          <v-col cols="12" md="5" sm="8">
            <Card>
              <template v-slot:title> Access Your Account </template>
              <template v-slot:text>
                <LoginOptionBtn
                img="icon-button-login.png"
                text="Input Mnemonic Phrase"
                @click="onUseMnemonic"
              ></LoginOptionBtn>

              <LoginOptionBtn
                img="icon-button-login.png"
                text="Import JSON Keystore"
                warning="Less secure"
                @click="onImportKeystore"
              >
              </LoginOptionBtn>
              </template>
            </Card>
          </v-col>
        </v-row>
        <v-row justify="center" style="margin: 0 auto;">
          <v-col cols="12" md="5" sm="8">
            <Card>
              <template v-slot:title> Create an Account </template>
              <template v-slot:text>
                <LoginOptionBtn
                  img="icon-button-login.png"
                  text="Generate Account"
                  @click="onGenerateAccount"
                ></LoginOptionBtn>
              </template>
            </Card>
          </v-col>
        </v-row>
      </v-container>

      <ImportKeystoreDialog
        :show="importKeystoreDialog"
        @toggle="importKeystoreDialog = $event"
      ></ImportKeystoreDialog>

      <GenerateAccountDialog
        :show="generateAccountDialog"
        @toggle="generateAccountDialog = $event"
        @terms-agreed="showSecretBackupPhraseDialog()"
      ></GenerateAccountDialog>

      <SecretBackupPhraseDialog
        :show="secretBackupPhraseDialog"
        :role="role"
        @toggle="secretBackupPhraseDialog = $event"
        @mnemonic-generated="({ mnemonic, role }) => showVerifyRecoveryPhraseDialog(mnemonic, role)"
      ></SecretBackupPhraseDialog>

      <VerifyRecoveryPhraseDialog
        :show="verifyRecoveryPhraseDialog"
        :role="role"
        :mnemonic="mnemonic"
        @toggle="verifyRecoveryPhraseDialog = $event"
        @mnemonic-and-role="({ mnemonic, role }) => showSetKeystorePasswordDialog(mnemonic, role)"
      ></VerifyRecoveryPhraseDialog>

      <SetKeystorePasswordDialog
        :secretType="secretType"
        :secret="secret"
        :show="setKeystorePasswordDialog"
        @toggle="setKeystorePasswordDialog = $event"
        @key-store-set="clearSecret"
        @key-store-set-cancelled="clearSecret"
      ></SetKeystorePasswordDialog>

      <AccessAccountMnemonicDialog
        :show="accessAccountMnemonicDialog"
        @toggle="accessAccountMnemonicDialog = $event"
        @mnemonic-input="(mnemonic) => setKeyStorePassword('accessAccountMnemonicDialog', 'mnemonic', mnemonic)"
      ></AccessAccountMnemonicDialog>
    </v-main>
  </v-app>
</template>

<script>
import { mapMutations } from "vuex"
import Card from "@/components/Card"
import DevMenu from "@/components/DevMenu"
import SettingsMenu from "@/components/SettingsMenu"
import LoginOptionBtn from "@/components/LoginOptionBtn"
import ImportKeystoreDialog from "@/components/ImportKeystoreDialog"
import GenerateAccountDialog from "@/components/GenerateAccountDialog"
import SecretBackupPhraseDialog from "@/components/SecretBackupPhraseDialog"
import SetKeystorePasswordDialog from "@/components/SetKeystorePasswordDialog"
import VerifyRecoveryPhraseDialog from "@/components/VerifyRecoveryPhraseDialog"
import AccessAccountMnemonicDialog from "@/components/AccessAccountMnemonicDialog"

export default {
  name: "Home",
  components: {
    Card,
    LoginOptionBtn,
    DevMenu,
    SettingsMenu,
    ImportKeystoreDialog,
    GenerateAccountDialog,
    SecretBackupPhraseDialog,
    SetKeystorePasswordDialog,
    VerifyRecoveryPhraseDialog,
    AccessAccountMnemonicDialog,
  },
  computed: {
    isDevEnv() {
      return process.env.NODE_ENV == "development";
    },
  },
  data: () => ({
    role: "",
    secret: "",
    mnemonic: "",
    secretType: "",
    importKeystoreDialog: false,
    generateAccountDialog: false,
    secretBackupPhraseDialog: false,
    setKeystorePasswordDialog: false,
    verifyRecoveryPhraseDialog: false,
    accessAccountMnemonicDialog: false,
  }),
  methods: {
    ...mapMutations({
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
    showSecretBackupPhraseDialog(){
      this.secretBackupPhraseDialog = true
    },
    showVerifyRecoveryPhraseDialog(mnemonic, role) {
      this.mnemonic = mnemonic
      this.role = role
      this.verifyRecoveryPhraseDialog = true
    },
    showSetKeystorePasswordDialog(mnemonic, role) {
      this.secret = mnemonic
      this.secretType = "mnemonic"
      this.role = role
      this.setKeystorePasswordDialog = true
    },
    setKeyStorePassword(previousDialog, secretType, secret) {
      this.secretType = secretType // mnemonic or privateKey
      this.secret = secret.mnemonic // mnemonic or privateKey string
      this[previousDialog] = false // Hide previous dialog
      this.setKeystorePasswordDialog = true
    },
    clearSecret() {
      this.secretType = ''
      this.secret = ''
    },
  },
};
</script>

<style lang="scss" scoped>
.login-main {
  background: rgba(0, 0, 0, 0.5);
  background: linear-gradient(
    25deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(63, 32, 64, 1) 24%,
    rgba(253, 192, 255, 1) 74%,
    rgba(255, 255, 255, 1) 96%
  );
}
.card-hover {
  border: 1px solid rgba(63, 32, 64, 0.5);
}
</style>
