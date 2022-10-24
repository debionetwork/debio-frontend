<template>
  <v-app>
    <v-app-bar app color="secondary" dark class="dg-app-bar" clipped-left>
      <div class="dg-app-bar-items-container">
        <a @click.stop="goToDashboard" style="text-decoration: none"
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
              DeBio {{ isDoctor && "Doctor" }}
            </div>
          </div>
        </a>
        <v-spacer/>
        <HeaderUserInfo />
        <!-- Menu For Development Purposes -->
        <!-- <MenuChangeRole /> -->
        <HeaderNotification :role="'doctor'"></HeaderNotification>
      </div>
    </v-app-bar>

    <NavigationDrawer width="200" />

    <v-main class="main" v-if="!isDoctorAccountExist && isDoctorDashboard">
      <router-view/>
    </v-main>

    <v-main class="dg-dashboard-main ml-5" v-else>
      <v-container>
        <Breadcrumbs />
        <div class="text-h5 secondary--text text--lighten-2">
          <b>{{ pageHeader }}</b>
        </div>
      </v-container>

      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import v from "voca";
import { mapState, mapGetters } from "vuex";
import Breadcrumbs from "@/views/Dashboard/Breadcrumbs";
// import MenuChangeRole from "@/components/MenuChangeRole";
import HeaderUserInfo from "@/components/HeaderUserInfo";
import NavigationDrawer from "@/components/NavigationDrawer";
import HeaderNotification from "@/components/HeaderNotification";

export default {
  name: "DashboardDoctor",
  components: {
    Breadcrumbs,
    NavigationDrawer,
    // MenuChangeRole,
    HeaderUserInfo,
    HeaderNotification
  },
  data: () => ({
    show: false,
    dialogAlert: false,
    alertTextBtn: "Continue",
    imgWidth: "270"
  }),
  mounted() {
    console.log("Is pair locked?", this.pair.isLocked);
    this.show = this.pair.isLocked;
  },
  computed: {
    ...mapGetters({
      pair: "substrate/wallet"
    }),

    ...mapState({
      isDoctorAccountExist: (state) => state.substrate.isDoctorAccountExist,
      wallet: (state) => state.substrate.wallet,
      lastEventData: (state) => state.substrate.lastEventData
    }),

    isDoctor() {
      return this.$route.path.indexOf("doctor") > 0;
    },

    isDoctorDashboard() {
      return this.$route.path === "/doctor" || this.$route.path === "/doctor/";
    },

    pageHeader() {
      return this.$route.meta.pageHeader
        ? this.$route.meta.pageHeader
        : v.titleCase(this.$route.name);
    }
  },
  watch: {
    lastEventData() {
      if (this.lastEventData != null) {
        this.$store.dispatch("substrate/addListNotification", {
          address: this.wallet.address,
          event: this.lastEventData,
          role: "doctor"
        });
      }
    }
  },
  methods: {
    toggle() {
      this.show = false;
    },

    goToDashboard() {
      this.$router.push({ path: "/doctor" });
    }
  }
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
