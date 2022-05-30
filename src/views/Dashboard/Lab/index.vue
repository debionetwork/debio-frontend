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
    <v-row v-else justify="center" class="pr20">
      <v-col cols="12" md="10">
        <v-card class="dg-card" elevation="0" outlined>
          <div class="secondary--text mt-5 ml-8 mb-5 lab-verified-box">
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
        </v-card>
      </v-col>
      <v-col cols="12" md="5">
        <MenuCard
          :height="120"
          class="mb-2"
          icon="mdi-microscope"
          title="Account"
          sub-title="Account page"
          :to="{ name: 'lab-dashboard-account' }"
        />
        <MenuCard
          :height="120"
          class="mb-2"
          icon="mdi-hand-heart"
          title="Services"
          sub-title="Services list"
          :to="{ name: 'lab-dashboard-services' }"
        />
        <MenuCard
          :height="120"
          class="mb-2"
          icon="mdi-clipboard-plus"
          title="Orders"
          sub-title="Payment History"
          :to="{ name: 'lab-dashboard-order-history' }"
        />
      </v-col>
      <v-col cols="12" md="5">
        <LabOrders />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex"
import MenuCard from "@/components/MenuCard"
import LabOrders from "./LabOrders";

export default {
  name: "Lab",

  components: {
    MenuCard,
    LabOrders
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
