<template>
  <v-app>
    <v-main class="request-service">
      <v-container fill-height fluid>
        <MapCountry />
        <ServiceTable v-if="!map" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import ServiceTable from "./ServiceTable"
import MapCountry from "./Mapping/MapCountry"
import serviceHandler from "@/mixins/serviceHandler"

export default {
  name: "RequestLab",
  mixins: [serviceHandler],

  components: { ServiceTable, MapCountry },

  data() {
    return {
      map: true
    }
  }
}
</script>

<style>
.request-service {
  background: rgba(0, 0, 0, 0.5);
  background: linear-gradient(
    25deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(63, 32, 64, 1) 24%,
    rgba(253, 192, 255, 1) 74%,
    rgba(255, 255, 255, 1) 96%
  );
}
</style>