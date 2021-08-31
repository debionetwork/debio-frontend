<template>
  <v-app>
    <v-main class="request-service">
      <v-container v-if="!isLoading" fill-height fluid>
        <MapCountry @openList="map = $event" v-if="map" :service-request-by-country="serviceRequestByCountry" />
        <ServiceTable @closeMap="map = $event" v-if="!map" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import ServiceTable from "./ServiceTable"
import MapCountry from "./Mapping/MapCountry"
import serviceHandler from "@/mixins/serviceHandler"
import { getServiceRequestCountries } from '@/api/service-request'

export default {
  name: "RequestLab",
  mixins: [serviceHandler],

  components: { ServiceTable, MapCountry },

  data() {
    return {
      map: true,
      serviceRequestByCountry: {},
      isLoading: true,
    }
  },

  async mounted() {
    this.isLoading = true
    await this.fetchServiceRequestCountries()
    this.isLoading = false
  },

  methods: {
    async fetchServiceRequestCountries() {
      try {
        const serviceRequests = await getServiceRequestCountries()
        for (let req of serviceRequests) {
          if (this.serviceRequestByCountry[req.country] == undefined) {
            this.serviceRequestByCountry[req.country] = {
              ...req
            }
          } else {
            this.serviceRequestByCountry[req.country].totalRequests += req.totalRequests
            this.serviceRequestByCountry[req.country].totalRequests += req.totalValue
          }
        }
        console.log(this.serviceRequestByCountry)
      } catch (err) {
        console.log(err)
      }
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