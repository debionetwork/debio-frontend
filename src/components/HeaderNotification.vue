<style scoped>
.notification {
  background: white;
  min-width: 287px;

  position: fixed;
  top: 56px;
  right: calc(287px + (287px / 2) - 15px);

  color: black;
  font-family: "Roboto";

  cursor: default;

  border: 1px solid rgb(228, 228, 228);
  box-shadow: 1px 3px 9px 2px rgba(0, 0, 0, 0.2);
  padding-bottom: 15px;
  border-radius: 5px;
}
.notification-title {
  font-size: 10pt;
  display: block;
  padding: 10px 3px 7px 3px;
  margin: 0 7px 0 7px;
  border-bottom: 1px solid rgb(172, 172, 172);
}
.notification-item {
  font-size: 11pt;
  margin: 0 7px 0 7px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-bottom: 1px solid rgb(172, 172, 172);
  cursor: pointer;
}
.notification-item > div:nth-child(2) > div:nth-child(2) {
  color: gray;
}
.notification-icon {
  padding: 5px;
  padding-right: 8px;
  margin-right: 8px;
  border-right: 1px solid rgb(172, 172, 172);
}
</style>
<template>
  <v-menu bottom left offset-y :close-on-content-click="false">
    <template v-slot:activator="{on, attrs}">
      <div class="d-flex align-center ml-3 mr-4" v-bind="attrs" v-on="on">
        <div class="d-flex align-center">
          <div style="cursor: pointer">
            <v-icon>mdi-bell</v-icon>
          </div>
        </div>
      </div>
    </template>
    <div>
      <v-card class="card-container">
        <div>
          <b class="notification-title">Notification ({{ notifLength }})</b>
          <div class="ml-2 mr-2" style="height: 250px; overflow: auto">
            <div
              v-for="(notif, index) in listNotif"
              v-bind:key="index"
              @click="gotoRoute(notif, index)"
              class="d-flex align-center justify-space-evenly notification-item"
            >
              <v-icon v-if="notif.read" class="notification-icon" color="grey" large
                >mdi-email-open</v-icon
              >
              <v-icon v-else class="notification-icon" color="grey" large
                >mdi-email</v-icon
              >
              <div>
                <div style="font-size: 14px">{{ notif.message }}</div>
                <div style="font-size: 12px">
                  {{ notif.notifDate }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="divider"></div>
      </v-card>
    </div>
  </v-menu>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { setReadNotification } from "@/lib/api"

let timeout

export default {
  name: "HeaderNotification",
  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      localListNotification: (state) => state.substrate.localListNotification
    })
  },

  props: {
    role: String
  },

  data: () => ({
    isLoading: false,
    balance: 0,
    name: "",
    listNotif: [],
    notifLength: 0,
    showDialog: false
  }),

  methods: {
    ...mapActions({
      clearAuth: "auth/clearAuth"
    }),

    async getListNotification() {
      await this.$store.dispatch("substrate/getListNotification", {
        address: this.wallet.address,
        role: this.role
      });
      this.setData();
    },

    setData() {
      this.listNotif = this.localListNotification;
      this.notifLength = this.listNotif.filter((x) => x.read == false).length;
    },
    
    async gotoRoute(notif, index) {
      if (this.listNotif[index].read == false) {
        clearTimeout(timeout)
        this.listNotif[index].read = true

        timeout = setTimeout(async () => {
          await setReadNotification(notif.notifId)
        }, 2000)

        this.$store.dispatch("substrate/updateDataListNotification", {
          address: this.wallet.address,
          role: this.role,
          data: this.listNotif
        });
      }
      // TODO: Remove this logic
      // if (this.$route.params.number === notif.params.number) return
      
      this.$router.push({
        name: notif.route,
        params: notif.params
      });
    }
  },

  watch: {
    localListNotification() {
      this.setData();
    }
  },

  async mounted() {
    await this.getListNotification();
  }
};
</script>
