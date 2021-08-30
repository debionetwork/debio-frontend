<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <!-- <div style="height: 31.3px;"></div> -->
          <div class="mb-2">
            <MenuCard
              :height="120"
              icon="mdi-hospital-building"
              title="Find a Lab"
              sub-title="Select a lab in your location"
              @click="$router.push({ name: 'find-lab' })"
            ></MenuCard>
          </div>
        </v-col>
        <v-col cols="12" md="4">
          <!-- <div style="height: 31.3px;"></div> -->
          <div class="mb-2">
            <MenuCard
              :height="120"
              icon="mdi-test-tube"
              title="Find a Test"
              sub-title="Get your DNA sample tested"
              @click="$router.push({ name: 'find-test' })"
            >
            </MenuCard>
            <!-- <MenuCard
              :height="120"
              icon="mdi-test-tube"
              title="Find a Test"
              sub-title="Under Development"
              @click="$router.push({ name: 'request-test' })"
            >
            </MenuCard> -->
          </div>
        </v-col>


        <v-col cols="12" xl="4" lg="4" md="4" order-md="2" order="1">
          <v-card class="dg-card alert" elevation="0" outlined>
            <v-toolbar flat dense color="transparent">
              <v-icon color="white">mdi-alert-circle</v-icon>
              <v-toolbar-title class="white--text ml-3">
                <b>Alert</b>
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text class="white--text pt-2 px-5 text-body">
              <div class="mb-2">
                Please select a lab that is as close to your location as
                possible.
              </div>
              <div>
                You need to do this because dna samples have limited shelf life.
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import MenuCard from "@/components/MenuCard";

export default {
  name: "RequestTest",
  components: {
    MenuCard,
  },
}
</script>

<style>

</style>


