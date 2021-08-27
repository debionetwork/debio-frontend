<style scoped>
.notification {
  background: white;
  min-width: 287px;

  position: absolute;
  top: 50px;
  right: 30px;

  color: black;
  font-family: "Roboto";

  cursor: default;

  border: 1px solid rgb(228, 228, 228);
  box-shadow: 1px 3px 9px 2px rgba(0, 0, 0, 0.2);
  padding-bottom: 15px;
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
  <div class="d-flex align-center ml-7 mr-5">
    <div class="d-flex align-center">
      <div style="cursor: pointer">
        <v-badge
          :content="notifLength"
          :value="notifLength"
          color="primary"
          overlap
        >
          <v-icon id="notificationBell">mdi-bell</v-icon>
        </v-badge>
      </div>
    </div>
    <div class="notification" v-if="showDialog">
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
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "HeaderNotification",
  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      localListNotification: (state) => state.substrate.localListNotification,
    }),
  },
  props: {
    role: String,
  },
  data: () => ({
    isLoading: false,
    balance: 0,
    name: "",
    listNotif: [],
    notifLength: 0,
    showDialog: false,
  }),
  methods: {
    ...mapMutations({
      setMetamaskAddress: "metamask/SET_WALLET_ADDRESS",
    }),
    ...mapActions({
      clearAuth: "auth/clearAuth",
    }),
    openNotif() {
      if (this.showDialog) {
        this.showDialog = false;
      } else {
        this.showDialog = true;
      }
    },
    async getListNotification() {
      await this.$store.dispatch("substrate/getListNotification", {
        address: this.wallet.address,
        role: this.role,
      });
      this.setData();
    },
    setData() {
      this.listNotif = this.localListNotification;
      this.notifLength = this.listNotif.filter((x) => x.read == false).length;
    },
    gotoRoute(notif, index) {
      if (this.listNotif[index].read == false) {
        this.listNotif[index].read = true;
        this.$store.dispatch("substrate/updateDataListNotification", {
          address: this.wallet.address,
          role: this.role,
          data: this.listNotif,
        });
      }

      if (this.$route.params.number === notif.params.number) return
      
      this.$router.push({
      name: notif.route,
      params: notif.params,
    });
    },
  },
  watch: {
    localListNotification() {
      this.setData();
    },
  },
  async mounted() {
    const inst = this;
    document.addEventListener("click", function (e) {
      if (e.target.id == "notificationBell") {
        inst.openNotif();
      } else {
        inst.showDialog = false;
      }
    });
    await this.getListNotification();
  },
};
</script>