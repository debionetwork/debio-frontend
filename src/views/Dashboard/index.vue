<template>
  <v-app>
    <v-app-bar
      app
      color="secondary"
      dark
      class="dg-app-bar"
    >
      <div class="dg-app-bar-items-container">
          <div class="d-flex align-center">
            <v-img
              alt="Vuetify Logo"
              class="shrink mr-2"
              contain
              src="@/assets/degenics-logo.webp"
              transition="scale-transition"
              width="40"
            />

            <div class="text-h6 font-weight-bold light_primary--text">
              Degenics {{ isLab ? 'Lab' : '' }}
            </div>
          </div>

          <v-spacer></v-spacer>
          <UserAccountMenu />
          <SettingsMenu dark />
          <!-- Menu For Development Purposes -->
          <DevMenu dark />
      </div>
    </v-app-bar>

    <v-main class="dg-dashboard-main">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import DevMenu from '../../components/DevMenu'
import UserAccountMenu from '../../components/UserAccountMenu'
import SettingsMenu from '../../components/SettingsMenu'

export default {
  name: 'Dashboard',
  components: {
    DevMenu,
    UserAccountMenu,
    SettingsMenu,
  },
  mounted() {
  },
  computed: {
    isLab() {
      return this.$route.path.indexOf('lab') > 0
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
