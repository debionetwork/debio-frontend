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
</style>

<template>
   <v-container :class="!isServicesExist ? 'center-all' : ''">
       <v-container
        v-if="!isServicesExist"
        >
         <h1 class="title-text-color">You don't have a lab account yet</h1>
         <v-btn
          color="primary"
           to="/lab/registration"
        >Register Now!</v-btn>
       </v-container>
       <v-row v-else>
        <v-col cols="12" md="12">
          <v-card class="dg-card" elevation="0" outlined>
            <div class="secondary--text mt-5 ml-8 mb-5 lab-verified-box">
              <v-icon 
                inline
                color="primary"
                :size="20"
                v-if="labAccount.verified_status == 'Verified'"
              >mdi-check-decagram</v-icon>
              <v-icon 
                inline
                color="yellow darken-2"
                :size="20"
                v-else
              >mdi-information</v-icon>

              <b v-if="labAccount.verified_status == 'Verified'">Your account has been verified</b>
              <b v-else>Your account has not been verified</b>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <MenuCard
              :height="120"
              class="mb-2"
              icon="mdi-microscope"
              title="Account"
              sub-title="Account page"
              @click="$router.push({ name: 'lab-dashboard-account' })"
          ></MenuCard>
          <MenuCard
              :height="120"
              class="mb-2"
              icon="mdi-hand-heart"
              title="Services"
              sub-title="Services list"
              @click="$router.push({ name: 'lab-dashboard-services' })"
          ></MenuCard>
          <MenuCard
              :height="120"
              class="mb-2"
              icon="mdi-clipboard-plus"
              title="Orders"
              sub-title="Payment History"
              @click="$router.push({ name: 'lab-dashboard-order-history' })"
          ></MenuCard>
        </v-col>
        <v-col cols="12" md="4">
          <LabOrders />
        </v-col>
        <v-col cols="12" md="4">
          <TestResults />
        </v-col>
       </v-row>
   </v-container>
</template>

<script>
import { mapState } from 'vuex'
import MenuCard from '@/components/MenuCard'
import LabOrders from "./LabOrders";
import TestResults from "./TestResults";

export default {
  name: 'Lab',
  components: {
    MenuCard,
    LabOrders,
    TestResults,
  },
  computed: {
    ...mapState({
      labAccount: (state) => state.substrate.labAccount,
      isServicesExist: (state) => state.substrate.isServicesExist,
    }),
  },
}
</script>