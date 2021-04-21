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
            v-for="sideButton in sideButtons" :key="sideButton"
          >
            <v-btn 
              class="font-weight-bold sidebar-text"
              text
              :disabled="sideButton.disabled"
            >{{ sideButton.text }}</v-btn>
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
    sideButtons: Array,
  }
}
</script>

<style lang="scss">
.sidebar-text{
  text-transform: none;
  letter-spacing: 0;
  font-size: 13pt !important;
}
.dg-raleway-font{
  font-family: 'Raleway', sans-serif;
}
</style>