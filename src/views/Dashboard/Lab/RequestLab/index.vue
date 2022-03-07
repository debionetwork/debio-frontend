<template>
  <v-app v-if="!isLoading">
    <MapCountry @openList="handleOpenList" v-if="map" :service-request-by-country="serviceRequestByCountry" />
    <v-main class="request-service" v-else>
      <v-container fill-height fluid>
        <ServiceTable :country-expand="country" :countries="countries" :size="size" :page="page" @closeMap="map = $event" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import ServiceTable from "./ServiceTable"
import MapCountry from "./Mapping/MapCountry"
import serviceHandler from "@/mixins/serviceHandler"
import { getServiceRequestCountries } from "@/lib/api"

export default {
  name: "RequestLab",
  mixins: [serviceHandler],

  components: { ServiceTable, MapCountry },

  data() {
    return {
      map: true,
      country: null,
      countries: [],
      serviceRequestByCountry: {},
      isLoading: true,
      size: 10,
      page: 1,
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
        this.countries = serviceRequests
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
      } catch (err) {
        console.error(err)
      }
    },

    handleOpenList(mapState, countryName) {
      this.map = mapState
      this.country = countryName
    }
  }
}
</script>

<style>
.request-service {
  padding: 1rem 3rem !important;
  background: rgb(208,228,255);
    background: linear-gradient(180deg, rgba(208,228,255,1) 0%, rgba(224,232,244,1) 70%, rgba(231,236,243,1) 100%);
}
</style>