<style scoped>
.title-text-color{
  color: #FDC0FF;
}
.center-all{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
}
.lab-verified-box {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 20px;
  border-radius: 5px;
}
.lab-verified-box > * {
  display: block;
  margin-right: 10px;
}
.pr20 {
  padding-right: 20px;
}
</style>

<template>
  <v-container :class="!allowDashboard ? 'center-all' : ''">
    <v-container v-if="!allowDashboard">
      <h1 class="title-text-color">You don't have a lab account yet</h1>
      <v-btn color="primary" to="/lab/registration">
        {{ computeStakingStatus ? "Continue Registration" : "Register Now!" }}
      </v-btn>
    </v-container>
    <div v-else>
      <div class="secondary--tex mb-5 lab-verified-box" v-if="labAccount.verificationStatus !== 'Verified'">
        <v-icon 
          inline
          color="primary"
          :size="20"
          v-if="labAccount && labAccount.verificationStatus == 'Verified'"
        >mdi-check-decagram</v-icon>
        <v-icon 
          inline
          color="yellow darken-2"
          :size="20"
          v-else
        >mdi-information</v-icon>
        <b v-if="labAccount && labAccount.verificationStatus == 'Unverified'">Your verification submission is being reviewed by DAOGenics</b>
        <b v-else>{{ computeVerificationStatus }}</b>
      </div>
      <OrderList isDashboard v-else />
    </div>
  </v-container>
</template>

<script>
import { mapState } from "vuex"
import OrderList from "@/components/OrderList";

export default {
  name: "Lab",

  components: {
    OrderList
  },

  computed: {
    ...mapState({
      isServicesExist: (state) => state.substrate.isServicesExist,
      labAccount: (state) => state.substrate.labAccount
    }),

    verificationStatus() {
      return this.labAccount?.verificationStatus
    },

    computeVerificationStatus() {
      return this.labAccount?.verificationStatus
        ? `Your lab account's verification status is: ${this.labAccount?.verificationStatus}`
        : "Loading verification..."
    },

    computeStakingStatus() {
      return this.labAccount?.stakeStatus === "Unstaked"
    },

    allowDashboard() {
      if (this.isServicesExist)
        if (this.labAccount?.stakeStatus === "Unstaked" && this.labAccount?.verificationStatus === "Unverified") return false
        else return true
      else return false
    }
  }
}
</script>
