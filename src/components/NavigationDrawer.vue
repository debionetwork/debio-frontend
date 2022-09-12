<style lang="scss">
.sidebar-text{
  text-transform: none !important;
  letter-spacing: 0 !important;
  font-size: 13pt !important;
}
.dg-raleway-font{
  font-family: 'Raleway', sans-serif;
}
.lineDivider {
  margin-top: 2rem;
}

.footerDrawer {
  margin: 65px 0 0;
}

.footerDrawer a {
  display: flex;
  font-weight: 400;
  font-size: .8rem;
  color: #363636;
}

.version {
  font-size: .7rem;
}
.btnDrawerIcon {
  margin: 0 16px 0 0;
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
    <v-toolbar flat class="text-h7 secondary--text " style="margin-top:220px;">
      <v-flex>
        <v-container
          class="pt-1 pb-1"
          v-for="(item, key) in computeDisabledCondition" :key="key"
        >
          <v-btn
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
        <v-divider class="lineDivider" />
        <div class="d-flex flex-column align-center">
          <div class="footerDrawer">
            <a
              class="d-flex"
              href="https://docs.debio.network/"
              target="_blank"
              style="text-decoration: none"
              rel="noreferrer noopener nofollow"
            >
              <ui-debio-icon
                class="btnDrawerIcon"
                :icon="bookIcon"
                size="16"
                stroke="stroke"
                color="#757274"
                viewBox="0 0 18 18"
              />
              <span>Customer Care</span>
            </a>
            <a
              class="mt-3 d-flex"
              href="https://docs.debio.network/legal/terms-and-condition"
              target="_blank"
              rel="noreferrer noopener nofollow"
              style="text-decoration: none"
            >
              <ui-debio-icon
                class="btnDrawerIcon"
                :icon="alertIcon"
                size="16"
                stroke="stroke"
                color="#757274"
              />
              <span>Terms and Condition</span>
            </a>
            <div class="version mt-16 mb-10 d-flex"><span class="mr-12">DeBio Network</span><span>{{ version }}</span></div>
          </div>
        </div>
      </v-flex>
    </v-toolbar>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";
import { bookIcon, alertIcon } from "@debionetwork/ui-icons"
import getEnv from "@/utils/env"

export default {
  name: "NavigationDrawer",
  props: {
    width: String
  },

  data: () => ({
    bookIcon,
    alertIcon,
    version: "",
    drawerButtons: [
      { text: "Dashboard", auth: true, route: { name: "lab-dashboard" } },
      { text: "Account", auth: false, route: { name: "lab-dashboard-account" } },
      { text: "Services", auth: false, route: { name: "lab-dashboard-services" } },
      { text: "Order History", auth: false, route: { name: "lab-dashboard-order-history" } }
    ]
  }),

  watch: {
    $route(val) {
      this.setActiveMenu(val.name)
    }
  },

  methods: {
    goLink(route){
      if(route != undefined && route.name != this.$route.name){
        this.$router.push(route)
      }
    },

    setActiveMenu(value) {
      this.drawerButtons = this.drawerButtons.map(btn => ({
        ...btn, active: btn.route?.name === value
      }))
    }
  },

  created() {
    this.setActiveMenu(this.$route.name)
    this.version = `v${getEnv("VUE_APP_VERSION")}`
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
