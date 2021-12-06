<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <!-- <div style="height: 31.3px;"></div> -->
          <div class="secondary--text mb-2"><b>Menu</b></div>
          <div class="mb-2">
            <MenuCard
              :height="120"
              icon="mdi-test-tube"
              title="Request Test"
              sub-title="Get your DNA samples tested"
              @click="$router.push({ name: 'request-test' })"
            ></MenuCard>
          </div>
          <div class="mb-2">
            <MenuCard
              :height="120"
              icon="mdi-dna"
              title="Download Genome"
              sub-title="Download your genomic data"
              @click="$router.push({ name: 'genome-files' })"
            ></MenuCard>
          </div>
          <div class="mb-2">
            <MenuCard
              :height="120"
              icon="mdi-file-document"
              title="Upload EMR"
              sub-title="Upload your genomic file"
              @click="uploadEMR = true"
            ></MenuCard>
          </div>
        </v-col>
        <v-col cols="12" md="4">
          <OrderHistory />
        </v-col>
        <v-col cols="12" md="4">
          <TestResults />
        </v-col>
      </v-row>
      <div class="d-flex justify-end" style="margin-top: 50px">
        <v-alert
          border="top"
          color="#ff56e0"
          colored-border
          icon="mdi-information"
          max-width="500"
        >
          After making a test request you can process the request by logging out
          (top navigation bar) and logging back in using one of the demo lab
          accounts
        </v-alert>
      </div>
      <UploadEMR
        :show="uploadEMR"
        @toggle="uploadEMR = $event"
        @status-upload="({ status }) => uploadSuccess(status)"
      ></UploadEMR>
    </v-container>
  </div>
</template>

<script>
import MenuCard from "@/components/MenuCard";
import OrderHistory from "./OrderHistory";
import TestResults from "./TestResults";
import UploadEMR from "@/views/Dashboard/Customer/EMR/UploadEMR";
import { mapState } from "vuex";

export default {
  name: "Home",
  components: {
    MenuCard,
    OrderHistory,
    TestResults,
    UploadEMR,
  },
  computed: {
    ...mapState({
      substrateWallet: (state) => state.substrate.wallet,
    }),
  },
  data: () => ({
    uploadEMR: false,
  }),
  methods: {
    uploadSuccess(status) {
      if (status) {
        this.$router.push({
          name: "documents",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.on-hover {
  cursor: pointer;
}
</style>
