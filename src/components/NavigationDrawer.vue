<style lang="scss">
.sidebar-text{
  text-transform: none !important;
  letter-spacing: 0 !important;
  font-size: 13pt !important;
}
.dg-raleway-font{
  font-family: 'Raleway', sans-serif;
}
</style>

<template>
    <v-navigation-drawer 
      app
      clipped
      fixed 
      permanent
      :width="this.width"
      class="mr-10 pt-10 dg-raleway-font"
    >
      <v-toolbar flat class="mt-15 text-h7 secondary--text ">
        <v-flex>
          <v-container
            class="pt-1 pb-1"
            v-for="(item, key) in drawerButtons" :key="key"
          >
            <v-btn 
              :class="item.active ? 'font-weight-bold sidebar-text primary--text':'font-weight-bold sidebar-text'"
              text
              @click="goLink(item.route)"
              :disabled="item.disabled != false"
            >{{ item.text }}</v-btn>
          </v-container>
        </v-flex>
      </v-toolbar>
    </v-navigation-drawer>
</template>

<script>
export default {
  name: 'NavigationDrawer',
  props: {
    width: String,
  },
  methods: {
    goLink(route){
      if(route != undefined && route.name != this.$route.name){
        this.$router.push(route)
      }
    }
  },
  computed: {
    drawerButtons() {
      if (this.$route.meta && this.$route.meta.drawerButtons) {
        return this.$route.meta.drawerButtons
      }
      return []
    },
  }
}
</script>