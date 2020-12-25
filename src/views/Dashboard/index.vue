<template>
  <v-app>
    <v-app-bar
      app
      color="secondary"
      dark
    >
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

      <!-- Menu For Development Purposes -->
      <DevMenu dark />
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import DevMenu from '../../components/DevMenu'
export default {
  name: 'Dashboard',
  components: {
    DevMenu
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

<style>

</style>
