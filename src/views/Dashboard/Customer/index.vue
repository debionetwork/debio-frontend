<template>
  <v-app>
    <v-app-bar app color="secondary" dark class="dg-app-bar" clipped-left>
      <div class="dg-app-bar-items-container">
        <a
          href="https://www.degenics.com/"
          target="_blank"
          style="text-decoration: none"
        >
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
              DeBio {{ isLab ? "Lab" : "" }}
            </div>
          </div>
        </a>

        <v-spacer></v-spacer>
        <HeaderUserInfo
          @showWalletBinding="({ status }) => openWalletBinding(status)"
        ></HeaderUserInfo>
        <!-- Menu For Development Purposes -->
        <MenuChangeRole />
        <HeaderNotification
          :role="'customer'"
        ></HeaderNotification>
      </div>
    </v-app-bar>

    <NavigationDrawer />

    <v-main class="dg-dashboard-main">
      <!-- Breadcrumbs and Header -->
      <WalletBinding
        :show="showWalletBinding"
        @toggle="showWalletBinding = $event"
        @status-wallet="({ status, img }) => connectWalletResult(status, img)"
      ></WalletBinding>
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

      <!-- Page Contents -->
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import v from "voca";
import MenuChangeRole from "@/components/MenuChangeRole";
import Breadcrumbs from "@/views/Dashboard/Breadcrumbs";
import NavigationDrawer from "@/components/NavigationDrawer";
import HeaderUserInfo from "@/components/HeaderUserInfo";
import WalletBinding from "@/components/WalletBinding";
import DialogAlert from "@/components/Dialog/DialogAlert";
import HeaderNotification from "@/components/HeaderNotification";
import { mapState } from "vuex";

export default {
  name: "Dashboard",
  components: {
    MenuChangeRole,
    Breadcrumbs,
    NavigationDrawer,
    HeaderUserInfo,
    WalletBinding,
    DialogAlert,
    HeaderNotification,
  },
  data: () => ({
    showWalletBinding: false,
    dialogAlert: false,
    alertTextBtn: "Continue",
    alertImgPath: "warning.png",
    alertTextAlert: "",
    imgWidth: "270",
  }),
  mounted() {},
  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      lastEventData: (state) => state.substrate.lastEventData,
    }),
    isLab() {
      return this.$route.path.indexOf("lab") > 0;
    },
    isDevEnv() {
      return process.env.NODE_ENV == "development";
    },
    pageHeader() {
      return this.$route.meta.pageHeader
        ? this.$route.meta.pageHeader
        : v.titleCase(this.$route.name);
    },
  },
  watch: {
    lastEventData() {
      if (this.lastEventData != null) {
        this.$store.dispatch("substrate/addListNotification", {
          address: this.wallet.address,
          event: this.lastEventData,
          role: "customer",
        });
      }
    },
  },
  methods: {
    openWalletBinding(status) {
      this.showWalletBinding = status;
    },
    connectWalletResult(status, img) {
      if (status) {
        this.alertImgPath = img;
        this.dialogAlert = true;
      }
    },
  },
};
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
</style>
