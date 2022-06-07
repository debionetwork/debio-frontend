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
    <v-toolbar flat class="text-h7 secondary--text " style="margin-top:90px;">
      <v-flex>
        <v-container
          class="pt-1 pb-1"
          v-for="(item, key) in computeDisabledCondition" :key="key"
        >
          <v-btn
            v-if="item.href"
            :class="item.active ? 'font-weight-bold sidebar-text primary--text' : 'font-weight-bold sidebar-text'"
            text
            @click="openHref(item.href)"
          >{{ item.text }}</v-btn>
          <v-btn
            v-else
            :class="item.active ? 'font-weight-bold sidebar-text primary--text' : 'font-weight-bold sidebar-text'"
            text
            @click="goLink(item.route)"
            :disabled="!item.auth"
          >
            <span class="text-left">
              {{ item.text }}
              <p v-if="item.subText" class="text-caption font-italic mb-0 black--text">{{ item.subText }}</p>
            </span>
          </v-btn>
        </v-container>
      </v-flex>
    </v-toolbar>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "NavigationDrawer",
  props: {
    width: String
  },

  data: () => ({
    drawerButtons: [
      { text: "Dashboard", auth: true, route: { name: "lab-dashboard" } },
      { text: "Account", auth: false, active: true, route: { name: "lab-dashboard-account" } },
      { text: "Services", auth: false, route: { name: "lab-dashboard-services" } },
      { text: "Order", auth: false, route: { name: "lab-dashboard-order-history" } },
      { text: "Customer Care", auth: true, href: "https://docs.debio.network/" }
    ]
  }),

  methods: {
    goLink(route){
      if(route != undefined && route.name != this.$route.name){
        this.$router.push(route)
      }
    },

    openHref(href){
      window.open(href, "_blank").focus();
    }
  },

  computed: {
    ...mapState({
      labAccount: (state) => state.substrate.labAccount
    }),
    computeDisabledCondition() {
      return this.drawerButtons.map(btn => {
        if (btn.text === "Dashboard" || btn.text === "Customer Care") return { ...btn }
        return {
          ...btn,
          auth: this.labAccount?.verificationStatus === "Verified"
            ? true
            : false
        }
      })
    }
  }
}
</script>
