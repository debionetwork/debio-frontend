<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" xl="8" lg="8" md="8" order-md="1" order="2">
          <v-card class="dg-card" elevation="0" outlined>
            <v-card-title class="px-8">
              <div class="text-h6">Select a Lab</div>
            </v-card-title>
            <v-card-text class="px-8">
              <v-autocomplete
                dense
                v-model="country"
                :key="country"
                :items="countries"
                item-text="name"
                item-value="alpha-2"
                @change="onCountryChange"
                label="Select Country"
                autocomplete="disabled"
                :disabled="showRequestNoLab"
                outlined
              ></v-autocomplete>

              <v-autocomplete
                dense
                v-model="city"
                :key="city"
                :items="cities"
                item-text="1"
                item-value="0"
                @change="onCityChange"
                label="Select City"
                :disabled="country == 'country' || showRequestNoLab"
                autocomplete="disabled"
                outlined
              ></v-autocomplete>
            </v-card-text>
          </v-card>
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

          <v-card class="dg-card mt-3" elevation="0">
            <v-card-text>
              <div>
                For demo purposes, available labs are located in
              </div>
              <div>
                <ul>
                  <li>Indonesia -> Jakarta Raya -> Jakarta Raya</li>
                  <li>Malaysia -> Johor -> Johor</li>
                </ul>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <div class="mt-5" >
        <v-row>
          <v-col cols="12" lg="8" md="8" sm="8">
            <v-btn
              depressed
              color="primary"
              large
              :disabled=" city == 'city'"
              width="100%"
              @click="toSelectCategoryPage"
            >
              Submit
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
import countryData from "@/assets/json/country.json";
import cityData from "@/assets/json/city.json";

export default {
  name: "FindTest",
  data: () => ({
    country: "country",
    city: "city",
    countries: [],
    category: "",
    cities: [],
    coinName: "",
    showRequestNoLab: false,
    showNoLab: false,
    requestNoLabItem: [],
    isLoadingRequestNoLab: false,
  }),
  async mounted() {
    this.coinName = this.configApp.tokenName;
    await this.getCountries();
  },
  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      configApp: (state) => state.auth.configApp,
    }),
    citiesSelection() {
      return this.cities
        .filter((c) => c.country == this.country)
        .map((c) => ({ value: c.city, text: c.city, country: c.country }));
    },
  },
  methods: {
    async getCountries() {
      this.showNoLab = false;
      this.countries = countryData;
    },
    onCountryChange(selectedCountry) {
      this.showNoLab = false;
      this.cities = [];
      this.city = "city";
      this.country = selectedCountry;
      this.cities = Object.entries(cityData[this.country].divisions);
    },
    onCityChange(selectedCity) {
      this.showNoLab = false;
      this.city = selectedCity;
    },
    async toSelectCategoryPage() {
      const country = this.country
      const city = this.city
      await this.$store.dispatch("lab/setCountryCity", {country, city});
      this.$router.push({ name: 'select-category' })
    }
  },
};
</script>

<style lang="scss">
</style>
