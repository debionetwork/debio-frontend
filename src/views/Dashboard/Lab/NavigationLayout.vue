<template>
  <v-app>
    <v-app-bar
      app
      color="secondary"
      dark
      class="dg-app-bar"
      clipped-left
    >
      <div class="dg-app-bar-items-container">
          <a href="https://www.degenics.com/" target="_blank" style="text-decoration: none;">
            <div class="d-flex align-center">
              <v-img
                alt="Vuetify Logo"
                class="shrink mr-2"
                contain
                src="@/assets/degenics-logo.png"
                transition="scale-transition"
                width="40"
              />
              <div class="text-h6 font-weight-bold light_primary--text">
                Degenics {{ isLab ? 'Lab' : '' }}
              </div>
            </div>
          </a>
          <v-spacer></v-spacer>
          <HeaderUserInfo />
          <!-- Menu For Development Purposes -->
          <MenuChangeRole />
      </div>
    </v-app-bar>

    <NavigationDrawer width="200" />

    <v-main class="main" v-if="!isLabAccountExist && isLabDashboard">
      <router-view></router-view>
    </v-main>

    <v-main class="dg-dashboard-main ml-5" v-else>
      <v-container>
        <Breadcrumbs />
        <div class="text-h5 secondary--text text--lighten-2">
          <b>{{ pageHeader }}</b>
        </div>
      </v-container>
      
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import v from 'voca'
import NavigationDrawer from '@/components/NavigationDrawer'
import Breadcrumbs from '@/views/Dashboard/Breadcrumbs'
import { mapState } from 'vuex'
import MenuChangeRole from "@/components/MenuChangeRole"
import HeaderUserInfo from "@/components/HeaderUserInfo"

export default {
  name: 'Dashboard',
  components: {
    Breadcrumbs,
    NavigationDrawer,
    MenuChangeRole,
    HeaderUserInfo
  },
  computed: {
    ...mapState({
      isLabAccountExist: (state) => state.substrate.isLabAccountExist,
    }),
    isLab() {
      return this.$route.path.indexOf('lab') > 0
    },
    isLabDashboard() {
      return this.$route.path === "/lab" || this.$route.path === "/lab/"
    },
    pageHeader() {
      return this.$route.meta.pageHeader
        ? this.$route.meta.pageHeader
        : v.titleCase(this.$route.name)
    }
  },
}
</script>

<style lang="scss">
@import '~vuetify/src/styles/styles.sass';
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
