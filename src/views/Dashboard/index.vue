<template>
  <v-app>
    <v-app-bar
      app
      color="secondary"
      dark
      class="dg-app-bar"
    >
      <div class="dg-app-bar-items-container">
          <a href="https://www.degenics.com/" target="_blank" style="text-decoration: none;">
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
                DeBio {{ isLab ? 'Lab' : '' }}
              </div>
            </div>
          </a>

          <v-spacer></v-spacer>
          <WalletBalance />
          <UserAccountMenu />
          <SettingsMenu dark />
          <!-- Menu For Development Purposes -->
          <DevMenu v-if="isDevEnv" dark />
      </div>
    </v-app-bar>

    <v-main class="dg-dashboard-main">
      <!-- Breadcrumbs and Header -->
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
import v from 'voca'
import DevMenu from '@/components/DevMenu'
import UserAccountMenu from '@/components/UserAccountMenu'
import SettingsMenu from '@/components/SettingsMenu'
import WalletBalance from '@/components/WalletBalance'
import Breadcrumbs from './Breadcrumbs'

export default {
  name: 'Dashboard',
  components: {
    DevMenu,
    UserAccountMenu,
    SettingsMenu,
    Breadcrumbs,
    WalletBalance,
  },
  computed: {
    isLab() {
      return this.$route.path.indexOf('lab') > 0
    },
    isDevEnv() {
      return process.env.NODE_ENV == 'development'
    },
    pageHeader() {
      return this.$route.meta.pageHeader
        ? this.$route.meta.pageHeader
        : v.titleCase(this.$route.name)
    }
  },
  methods: {
  }
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
</style>
