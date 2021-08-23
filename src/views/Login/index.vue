<template>
  <v-app>
    <!-- <v-app-bar app flat color="transparent" dense>
      <v-spacer></v-spacer>
      <SettingsMenu />
      <DevMenu v-if="isDevEnv" />
    </v-app-bar> -->
    <v-main class="login-main">
      <v-container fill-height>
        <v-row align="center">
          <v-col cols="12" lg="12" md="12" sm="12">
            <v-row class="justify-center">
              <v-col cols="12" lg="5" md="5" sm="5" align="center">
                <v-img src="@/assets/debio-logo-words-grey.png" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" lg="12" md="12" sm="12" align="center">
                <div class="white--text text-lg-h6 mt-3">
                  The Privacy-First Platform for Personal Genetic Testing
                </div>
              </v-col>
            </v-row>
            <v-row class="justify-center mt-10 align-center">
              <v-col cols="12" lg="3" md="5" sm="8" align="center">
                <Button
                  color="white"
                  elevation="2"
                  @click="onGenerateAccount"
                  dark
                >
                  <div class="primary--text">Create Account</div>
                </Button>
              </v-col>
              <v-col cols="12" lg="3" md="5" sm="8" align="center">
                <Button @click="openSignIn" elevation="2" dark>
                  Sign In
                </Button>
              </v-col>
            </v-row>
            <v-row class="justify-center mt-10 align-center">
              <v-col cols="12" align="center">
                <DemoLabAccounts @lab-selected="({ mnemonic }) => showSetKeystorePasswordDialog(mnemonic)" />
              </v-col>
            </v-row>
            <v-row class="justify-center mt-2 align-center">
              <v-col cols="12" align="center">
                <div style="max-width: 570px; color: white;">
                  Login as a lab to process your order using these preexisting accounts or create a new lab account and customize your own services
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>

      <DialogSelectUserLogin
        :show="dialogSelectUserLogin"
        @toggle="dialogSelectUserLogin = $event"
        @forgot-password="
          ({ status, address }) => onUseMnemonic(status, address)
        "
        @key-store-set="successLoginAction"
        @show-mnemonic-form="showMnemonicForm"
      ></DialogSelectUserLogin>

      <GenerateAccountDialog
        :show="generateAccountDialog"
        @toggle="generateAccountDialog = $event"
        @terms-agreed="showSecretBackupPhraseDialog()"
      ></GenerateAccountDialog>

      <SecretBackupPhraseDialog
        :show="secretBackupPhraseDialog"
        :role="role"
        @toggle="secretBackupPhraseDialog = $event"
        @mnemonic-generated="
          ({ mnemonic, role }) => showVerifyRecoveryPhraseDialog(mnemonic, role)
        "
      ></SecretBackupPhraseDialog>

      <VerifyRecoveryPhraseDialog
        :show="verifyRecoveryPhraseDialog"
        :role="role"
        :mnemonic="mnemonic"
        @toggle="verifyRecoveryPhraseDialog = $event"
        @mnemonic-and-role="
          ({ mnemonic, role }) => showSetKeystorePasswordDialog(mnemonic, role)
        "
      ></VerifyRecoveryPhraseDialog>

      <SetKeystorePasswordDialog
        :secretType="secretType"
        :secret="secret"
        :show="setKeystorePasswordDialog"
        @toggle="setKeystorePasswordDialog = $event"
        @key-store-set="successLoginAction"
        @key-store-set-cancelled="clearSecret"
      ></SetKeystorePasswordDialog>

      <AccessAccountMnemonicDialog
        :show="accessAccountMnemonicDialog"
        :type="'forgot-password'"
        @toggle="accessAccountMnemonicDialog = $event"
        @mnemonic-input="
          (mnemonic) =>
            checkForgotPassword(
              'accessAccountMnemonicDialog',
              'mnemonic',
              mnemonic
            )
        "
      ></AccessAccountMnemonicDialog>

      <AccessAccountMnemonicDialog
        :show="loginUsingMnemonicDialog"
        :type="'login-mnemonic'"
        @toggle="loginUsingMnemonicDialog = $event"
        @mnemonic-input-login="
          ({ mnemonic }) => showSetKeystorePasswordDialog(mnemonic)
        "
      ></AccessAccountMnemonicDialog>

      <DialogAlert
        :show="dialogAlert"
        :btnText="alertTextBtn"
        :textAlert="alertTextAlert"
        :imgPath="alertImgPath"
        :imgWidth="imgWidth"
        @toggle="dialogAlert = $event"
        @close="actionAlert()"
      ></DialogAlert>

      <LandingDemo
        :show="showLandingDemo"
        @close="showLandingDemo=false"
      ></LandingDemo>
    </v-main>
  </v-app>
</template>

<script>
import { mapMutations, mapActions } from "vuex";
//import DevMenu from "@/components/DevMenu";
//import SettingsMenu from "@/components/SettingsMenu";
import Button from "@/components/Button";
import DialogSelectUserLogin from "@/components/DialogSelectUserLogin";
import GenerateAccountDialog from "@/components/GenerateAccountDialog";
import SecretBackupPhraseDialog from "@/components/SecretBackupPhraseDialog";
import SetKeystorePasswordDialog from "@/components/SetKeystorePasswordDialog";
import VerifyRecoveryPhraseDialog from "@/components/VerifyRecoveryPhraseDialog";
import AccessAccountMnemonicDialog from "@/components/AccessAccountMnemonicDialog";
import DialogAlert from "@/components/Dialog/DialogAlert";
import LandingDemo from "@/views/Login/LandingDemo";
import DemoLabAccounts from '@/views/Login/DemoLabAccounts';

export default {
  name: "Home",
  components: {
    Button,
    //DevMenu,
    //SettingsMenu,
    DialogSelectUserLogin,
    GenerateAccountDialog,
    SecretBackupPhraseDialog,
    SetKeystorePasswordDialog,
    VerifyRecoveryPhraseDialog,
    AccessAccountMnemonicDialog,
    DialogAlert,
    LandingDemo,
    DemoLabAccounts,
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
    dialogSelectUserLogin: false,
    generateAccountDialog: false,
    secretBackupPhraseDialog: false,
    setKeystorePasswordDialog: false,
    verifyRecoveryPhraseDialog: false,
    accessAccountMnemonicDialog: false,
    loginUsingMnemonicDialog: false,
    forgotAddress: "",
    dialogAlert: false,
    alertTextBtn: "",
    alertImgPath: "warning.png",
    alertTextAlert: "",
    imgWidth: "50",
    successLogin: false,
    typelogin: "",
    showLandingDemo: true,
  }),
  methods: {
    ...mapActions({
      checkMnemonicSomeAddress: "substrate/checkMnemonicSomeAddress",
    }),
    ...mapMutations({}),
    onGenerateAccount() {
      this.generateAccountDialog = true;
      this.typelogin = "register";
    },
    onUseMnemonic(status, address) {
      if (status) {
        this.forgotAddress = address;
        this.accessAccountMnemonicDialog = true;
      }
    },
    showMnemonicForm() {
      this.loginUsingMnemonicDialog = true;
    },
    openSignIn() {
      this.dialogSelectUserLogin = true;
      this.typelogin = "login";
    },
    showSecretBackupPhraseDialog() {
      this.secretBackupPhraseDialog = true;
    },
    showVerifyRecoveryPhraseDialog(mnemonic, role) {
      this.mnemonic = mnemonic;
      this.role = role;
      this.verifyRecoveryPhraseDialog = true;
    },
    showSetKeystorePasswordDialog(mnemonic, role) {
      this.secret = mnemonic;
      this.secretType = "mnemonic";
      this.role = role;
      this.setKeystorePasswordDialog = true;
    },
    async checkForgotPassword(previousDialog, secretType, secret) {
      const result = await this.checkMnemonicSomeAddress({
        mnemonic: secret.mnemonic,
        accountAddress: this.forgotAddress,
      });

      if (result.success) {
        this.setKeyStorePassword(previousDialog, secretType, secret);
      } else {
        this.alertTextBtn = "OKE";
        this.alertImgPath = "warning.png";
        this.alertTextAlert =
          "Supplied mnemonic phrase and account password does not match any existing accounts.";
        this.dialogAlert = true;
      }
    },
    setKeyStorePassword(previousDialog, secretType, secret) {
      this.secretType = secretType; // mnemonic or privateKey
      this.secret = secret.mnemonic; // mnemonic or privateKey string
      this[previousDialog] = false; // Hide previous dialog
      this.setKeystorePasswordDialog = true;
    },
    clearSecret() {
      this.secretType = "";
      this.secret = "";
      this.successLogin = false;
      this.typelogin = "";
    },
    async actionAlert() {
      if (this.successLogin) {
        this.clearSecret();
        await this.$store.dispatch("substrate/connect");
        await this.$store.dispatch("substrate/getLabAccount");
        this.$router.push("/");
      } else {
        this.clearSecret();
      }
    },
    successLoginAction() {
      const { redirect, ...payload } = this.$route.query

      this.successLogin = true;
      this.alertTextBtn = "Continue";
      this.alertImgPath = "success.png";
      if (this.typelogin == "login") {
        this.alertTextAlert = "Login successful, welcome back!";
      } else {
        this.alertTextAlert = "Account registration successful!";
      }
      this.dialogAlert = true;

      if (redirect) this.$router.push({ name: redirect, query: { ...payload } })
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
