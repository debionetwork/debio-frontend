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
        <!-- <MenuChangeRole /> -->
        <HeaderNotification :role="'lab'"></HeaderNotification>
      </div>
    </v-app-bar>

    <NavigationDrawer width="200" />

    <v-main class="main" v-if="!isServicesExist && isLabDashboard">
      <router-view></router-view>
    </v-main>

    <v-main class="dg-dashboard-main ml-5" v-else>
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

      <router-view></router-view>
    </v-main>

    <UnlockWalletDialog :show="show" @toggle="toggle()"></UnlockWalletDialog>
  </v-app>
</template>

<script>
import v from "voca";
import { mapState, mapGetters } from "vuex";
import Breadcrumbs from "@/views/Dashboard/Breadcrumbs";
// import MenuChangeRole from "@/components/MenuChangeRole";
import HeaderUserInfo from "@/components/HeaderUserInfo";
import NavigationDrawer from "@/components/NavigationDrawer";
import UnlockWalletDialog from "@/components/UnlockWalletDialog";
import HeaderNotification from "@/components/HeaderNotification";
import WalletBinding from "@/components/WalletBinding";
import DialogAlert from "@/components/Dialog/DialogAlert";
import { queryBalance } from "@/lib/polkadotProvider/query/balance";
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
  },
  data: () => ({
    show: false,
    showWalletBinding: false,
    dialogAlert: false,
    alertTextBtn: "Continue",
    alertImgPath: "warning.png",
    alertTextAlert: "",
    imgWidth: "270",
  }),
  async mounted() {
    console.log("Is pair locked lab?", this.pair.isLocked);
    this.show = this.pair.isLocked;

    const balance = await queryBalance(
      this.api,
      this.wallet.address
    );

    if (balance <= 0) {
      this.$store.dispatch("registration/registration", {
        accountId: localStorage.getAddress(),
        role: "lab",
      })
    }

  },
  computed: {
    ...mapGetters({
      pair: "substrate/wallet",
    }),
    ...mapState({
      isServicesExist: (state) => state.substrate.isServicesExist,
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      lastEventData: (state) => state.substrate.lastEventData,
    }),
    isLab() {
      return this.$route.path.indexOf("lab") > 0;
    },
    isLabDashboard() {
      return this.$route.path === "/lab" || this.$route.path === "/lab/";
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
          role: "lab",
        });
      }
    },
  },
  methods: {
    toggle() {
      this.show = false;
    },
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
.main {
  background: rgba(0, 0, 0, 0.5);
  background: linear-gradient(
    150deg,
    rgb(115, 46, 117) 0%,
    rgba(0, 0, 0, 1) 96%
  );
}
</style>
