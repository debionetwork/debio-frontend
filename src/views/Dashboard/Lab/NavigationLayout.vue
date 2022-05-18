<template>
  <v-app>
    <v-app-bar app color="secondary" dark class="dg-app-bar" clipped-left>
      <div class="dg-app-bar-items-container">
        <a @click.stop="goToDashboard" style="text-decoration: none">
          <div class="d-flex align-center">
            <v-img
              alt="Vuetify Logo"
              class="shrink mr-2"
              contain
              src="@/assets/debio-logo.png"
              transition="scale-transition"
              width="40"
            />
            <div class="text-h6 font-weight-bold light_primary--text">
              DeBio {{ isLab && "Lab" }}
            </div>
          </div>
        </a>
        <v-spacer />
        <HeaderUserInfo />
        <!-- Menu For Development Purposes -->
        <!-- <MenuChangeRole /> -->
        <HeaderWallet @showWalletBinding="openWalletBinding"></HeaderWallet>
        <HeaderNotification :role="'lab'"></HeaderNotification>
        <div class="d-flex align-center ml-3 mr-5">
          <div style="cursor: pointer" @click="logOut">
            <v-icon>mdi-logout</v-icon>
          </div>
        </div>
      </div>
    </v-app-bar>

    <NavigationDrawer width="200" />
    <WalletBinding
      :show="showWalletBinding"
      @toggle="showWalletBinding = $event"
      @status-wallet="({status, img}) => connectWalletResult(status, img)"
    ></WalletBinding>

    <!-- <v-main class="main" v-if="(!isServicesExist || ((labAccount && labAccount.verificationStatus == 'Unverified') && !computeStakingStatus)) && isLabDashboard"> -->
    <v-main class="main" v-if="!allowDashboard && isLabDashboard">
      <router-view />
    </v-main>

    <v-main class="dg-dashboard-main ml-5" v-else>
      <DialogAlert
        :show="dialogAlert"
        :btnText="alertTextBtn"
        :textAlert="alertTextAlert"
        :imgPath="alertImgPath"
        :imgWidth="imgWidth"
        @toggle="dialogAlert = $event"
        @close="dialogAlert = false"
      ></DialogAlert>
      <v-container>
        <Breadcrumbs />
        <div class="text-h5 secondary--text text--lighten-2">
          <b>{{ pageHeader }}</b>
        </div>
      </v-container>

      <router-view />
    </v-main>

    <UnlockWalletDialog :show="show" @toggle="toggle()"></UnlockWalletDialog>
    <ErrorConnectionDialog :show="showError" @action="onCloseError()" />
  </v-app>
</template>

<script>
import v from "voca"
import {mapState, mapGetters, mapActions} from "vuex"
import Breadcrumbs from "@/views/Dashboard/Breadcrumbs"
// import MenuChangeRole from "@/components/MenuChangeRole";
import HeaderUserInfo from "@/components/HeaderUserInfo"
import NavigationDrawer from "@/components/NavigationDrawer"
import UnlockWalletDialog from "@/components/UnlockWalletDialog"
import ErrorConnectionDialog from "@/components/Dialog/DialogErrorConnection"
import HeaderNotification from "@/components/HeaderNotification"
import WalletBinding from "@/components/WalletBinding"
import DialogAlert from "@/components/Dialog/DialogAlert"
import HeaderWallet from "@/components/HeaderWallet"
import VueRouter from "@/router"
import localStorage from "@/lib/local-storage";

export default {
  name: "Dashboard",
  components: {
    Breadcrumbs,
    NavigationDrawer,
    // MenuChangeRole,
    HeaderUserInfo,
    UnlockWalletDialog,
    HeaderNotification,
    WalletBinding,
    DialogAlert,
    ErrorConnectionDialog,
    HeaderWallet
  },

  data: () => ({
    showError: false,
    show: false,
    showWalletBinding: false,
    dialogAlert: false,
    alertTextBtn: "Continue",
    alertImgPath: "warning.png",
    alertTextAlert: "",
    imgWidth: "270"
  }),

  async mounted() {
    this.show = this.pair.isLocked
  },

  computed: {
    ...mapGetters({
      pair: "substrate/wallet"
    }),

    ...mapState({
      isServicesExist: (state) => state.substrate.isServicesExist,
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      lastEventData: (state) => state.substrate.lastEventData,
      labAccount: (state) => state.substrate.labAccount
    }),

    isLab() {
      return this.$route.path.indexOf("lab") > 0
    },

    isLabDashboard() {
      return this.$route.path === "/lab" || this.$route.path === "/lab/"
    },

    pageHeader() {
      return this.$route.meta.pageHeader
        ? this.$route.meta.pageHeader
        : v.titleCase(this.$route.name)
    },

    computeStakingStatus() {
      return this.labAccount?.stakeStatus === "Unstaked"
    },

    allowDashboard() {
      if (this.isServicesExist)
        if (this.labAccount?.stakeStatus === "Unstaked" && this.labAccount?.verificationStatus === "Unverified") return false
        else return true
      else return false
    }
  },
  watch: {
    $route() {
      const query = VueRouter?.history?.current?.query

      if (query?.error) this.showError = true
    },

    lastEventData(val) {
      if (val !== null) {
        if (val.method === "LabRegistered") return

        this.$store.dispatch("substrate/addListNotification", {
          address: this.wallet.address,
          event: val,
          role: "lab"
        })
      }
    }
  },
  methods: {
    ...mapActions({
      clearAuth: "auth/clearAuth"
    }),

    toggle() {
      this.show = false
    },

    openWalletBinding(status) {
      this.showWalletBinding = status
    },

    connectWalletResult(status, img) {
      if (status) {
        this.alertImgPath = img
        this.dialogAlert = true
      }
    },

    onCloseError() {
      this.showError = false
      this.goToDashboard()
    },

    goToDashboard() {
      this.$router.push({path: "/lab"})
    },

    logOut() {
      this.clearAuth();
      localStorage.clear();
      this.$store.dispatch("lab/setProvideService", {})
      this.$store.commit("substrate/SET_IS_SERVICES_EXIST", false)
      this.$router.push("/login");
    }
  }
}
</script>

<style lang="scss">
@import "~vuetify/src/styles/styles.sass";
@media screen and (min-width: 960px) {
  div.dg-app-bar-items-container {
    max-width: 900px !important;
  }
}
@media screen and (min-width: 1264px) {
  div.dg-app-bar-items-container {
    max-width: 1185px !important;
  }
}
@media screen and (min-width: 1904px) {
  div.dg-app-bar-items-container {
    max-width: 1400px !important;
  }
}
.dg-app-bar {
  > div {
    justify-content: center;

    div.dg-app-bar-items-container {
      display: flex;
      width: 100%;
    }
  }
}
.dg-dashboard-main {
  background: #e5e5e5;
}
.main {
  background: rgba(0, 0, 0, 0.5);
  background: linear-gradient(
    150deg,
    rgb(115, 46, 117) 0%,
    rgba(0, 0, 0, 1) 96%
  );
}
</style>
