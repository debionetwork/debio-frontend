<template>
  <v-app>
    <v-main class="login-main">
      <v-container fill-height>
        <v-row align="center">
          <v-col cols="12" lg="12" md="12" sm="12">
            <v-row class="justify-center">
              <v-col cols="12" lg="5" md="5" sm="5" align="center">
                <v-img src="@/assets/debio-logo-words-grey.png" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" lg="12" md="12" sm="12" align="center">
                <div class="white--text text-lg-h6 mt-3">
                  The Privacy-First Platform for Personal Genetic Testing
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>

      <DialogSelectRole
        :show="dialogSelectRole"
        @toggle="dialogSelectRole = $event"
        @close="({ openRole }) => actionAlert(openRole)"
      ></DialogSelectRole>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions } from "vuex";
import DialogSelectRole from "@/components/Dialog/DialogSelectRole";

export default {
  name: "SelectRoleGroup",
  components: {
    DialogSelectRole,
  },
  computed: {
    isDevEnv() {
      return process.env.NODE_ENV == "development";
    },
  },
  data: () => ({
    dialogSelectRole: true,
  }),
  methods: {
    ...mapActions({
      checkMnemonicSomeAddress: "substrate/checkMnemonicSomeAddress",
    }),
    actionAlert(openRole) {
      this.$router.push(`/${openRole}`);
    },
  
  },
};
</script>

<style lang="scss" scoped>
.login-main {
  background: rgba(0, 0, 0, 0.5);
  background: linear-gradient(
    25deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(63, 32, 64, 1) 24%,
    rgba(253, 192, 255, 1) 74%,
    rgba(255, 255, 255, 1) 96%
  );
}
.card-hover {
  border: 1px solid rgba(63, 32, 64, 0.5);
}
</style>
