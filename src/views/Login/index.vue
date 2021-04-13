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
        <!-- <v-row justify="center">
          <v-col cols="12" md="5" sm="8">
            <Card>
              <template v-slot:title_icon>
                <v-icon color="#373737">mdi-account-multiple</v-icon>
              </template>
              <template v-slot:title> Customers </template>

              <template v-slot:text>
                <div class="mb-3">
                  <Button color="primary" @click="onLogin('customer')">
                    Login
                  </Button>
                </div>
                <div class="mb-3">
                  <Button
                    color="primary"
                    outlined
                    @click="onGenerateAccount('customer')"
                  >
                    Generate Account
                  </Button>
                </div>
              </template>
            </Card>
          </v-col>
        </v-row> -->

        <!-- <v-row justify="center">
          <v-col cols="12" md="5" sm="8">
            <Card>
              <template v-slot:title_icon>
                <v-icon color="#373737">mdi-microscope</v-icon>
              </template>
              <template v-slot:title> Labs </template>

              <template v-slot:text>
                <div class="mb-3">
                  <Button color="secondary" @click="onLogin('lab')">
                    Login
                  </Button>
                </div>
                <div class="mb-3">
                  <Button
                    color="secondary"
                    outlined
                    @click="onGenerateAccount('lab')"
                  >
                    Generate Account
                  </Button>
                </div>
              </template>
            </Card>
          </v-col>
        </v-row> -->
      </v-container>

      <GenerateAccountDialog
        :show="generateAccountDialog"
        @toggle="generateAccountDialog = $event"
        @mnemonic-generated="(mnemonic) => setKeyStorePassword('generateAccountDialog', 'mnemonic', mnemonic)"
      ></GenerateAccountDialog>

      <AccessAccountMnemonicDialog
        :show="accessAccountMnemonicDialog"
        @toggle="accessAccountMnemonicDialog = $event"
        @mnemonic-input="(mnemonic) => setKeyStorePassword('accessAccountMnemonicDialog', 'mnemonic', mnemonic)"
      ></AccessAccountMnemonicDialog>

      <ImportKeystoreDialog
        :show="importKeystoreDialog"
        @toggle="importKeystoreDialog = $event"
      ></ImportKeystoreDialog>
      
      <SetKeystorePasswordDialog
        :secretType="secretType"
        :secret="secret"
        :show="setKeystorePasswordDialog"
        @toggle="setKeystorePasswordDialog = $event"
        @key-store-set="clearSecret"
        @key-store-set-cancelled="clearSecret"
      ></SetKeystorePasswordDialog>

      <!-- <GenerateAccountDialog
        :show="generateAccountDialog"
        :role="role"
        @toggle="generateAccountDialog = $event"
        @mnemonic-generated="
          ({ mnemonic, role }) => onAccountGenerated(mnemonic, role)
        "
      ></GenerateAccountDialog>
      <AccessAccountMnemonicDialog
        :show="accessAccountMnemonicDialog"
        :role="role"
        @toggle="accessAccountMnemonicDialog = $event"
        @mnemonic-input="
          ({ mnemonic, role }) => onMnemonicValidated(mnemonic, role)
        "
      ></AccessAccountMnemonicDialog> -->
    </v-main>
  </v-app>
</template>

<script>
import { mapMutations } from "vuex";
import Card from "@/components/Card";
import LoginOptionBtn from "@/components/LoginOptionBtn";
import DevMenu from "@/components/DevMenu";
import SettingsMenu from "@/components/SettingsMenu";
import GenerateAccountDialog from "@/components/GenerateAccountDialog";
import AccessAccountMnemonicDialog from "@/components/AccessAccountMnemonicDialog";
import ImportKeystoreDialog from '@/components/ImportKeystoreDialog';
import SetKeystorePasswordDialog from '@/components/SetKeystorePasswordDialog'
//import Button from "@/components/Button";

export default {
  name: "Home",
  components: {
    Card,
    LoginOptionBtn,
    DevMenu,
    SettingsMenu,
    GenerateAccountDialog,
    AccessAccountMnemonicDialog,
    ImportKeystoreDialog,
    SetKeystorePasswordDialog,
    //Button,
  },
  computed: {
    isDevEnv() {
      return process.env.NODE_ENV == "development";
    },
  },
  data: () => ({
    generateAccountDialog: false,
    accessAccountMnemonicDialog: false,
    setKeystorePasswordDialog: false,
    importKeystoreDialog: false,
    role: "",
    secretType: '',
    secret: '',
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
    setKeyStorePassword(previousDialog, secretType, secret) {
      this.secretType = secretType // mnemonic or privateKey
      this.secret = secret.mnemonic // mnemonic or privateKey string
      console.log(this.secret)
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
