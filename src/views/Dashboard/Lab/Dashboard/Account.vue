<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" xl="8" lg="8" md="8" order-md="1" order="2">
          <v-card class="dg-card mb-10" elevation="0" outlined>
            <div class="secondary--text mt-5 ml-8"><b>Your Account is not verified</b></div>
            <v-card-text class="px-8">
                <p class="black--text">
                    We recommend that you go through the lab verification process in order to receive the verified badge
                    <v-icon 
                      inline
                      color="primary"
                      :size="16"
                    >mdi-check-decagram</v-icon>.
                    <br>
                    Otherwise, you can skip this step and do this later.
                </p>
                <v-btn
                    color="primary"
                    block
                    medium>Verify Account</v-btn>
            </v-card-text>
          </v-card>

          <v-card class="dg-card" elevation="0" outlined>
            <v-card-text class="px-8 mt-5">
              <div class="secondary--text mb-10 h6">
                <b>Lab Account Information</b>
              </div>

              <v-file-input
                dense
                label="Profile Image"
                placeholder="Profile Image"
                prepend-icon="mdi-image"
                outlined
                ></v-file-input>

              <v-text-field
                dense
                label="Email"
                placeholder="Email"
                outlined
                ></v-text-field>
              
              <v-text-field
                dense
                label="Lab Name"
                placeholder="Lab Name"
                outlined
                ></v-text-field>

              <v-select
                dense
                :items="countries"
                :value="country"
                @change="onCountryChange"
                label="Select Country"
                outlined
              ></v-select>

              <v-select
                dense
                :items="citiesSelection"
                :value="city"
                @change="onCityChange"
                label="Select City"
                :disabled="!country"
                outlined
              ></v-select>
              
              <v-text-field
                dense
                label="Address"
                placeholder="Address"
                outlined
                ></v-text-field>

                <v-btn
                    color="primary"
                    block
                    large>Submit</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Lab Account',
  async mounted() {
    await this.getCountries()
    await this.getCities()
  },
  computed: {
    ...mapState({
      locationContract: state => state.ethereum.contracts.contractLocation,
      degenicsContract: state => state.ethereum.contracts.contractDegenics,
    }),
    citiesSelection() {
      return this.cities
        .filter(c => c.country == this.country)
        .map(c => ({ value: c.city, text: c.city, country: c.country }))
    }
  },
  data: () => ({
    country: '',
    city: '',
    countries: [],
    cities: [],
  }),
  methods: {
    async getCountries() {
      const countryCount = await this.locationContract.methods.countCountry().call()

      const getCountryPromises = []
      for (let i = 1; i <= countryCount; i++) {
        getCountryPromises.push(
          this.locationContract.methods.countryByIndex(i).call()
        )
      }
      const countries = await Promise.all(getCountryPromises)

      this.countries = countries
    },
    async getCities() {
      if (!this.countries) { return }

      const getCitiesPromises = []
      for (let country of this.countries) {
        const cityCount = await this.locationContract.methods.countCity(country).call()
        for(let i = 1; i <= cityCount; i++) {
          const promise = this.locationContract.methods
            .cityByIndex(country, i).call()
            .then(city => ({ country, city }))

          getCitiesPromises.push(promise)
        }
      }
      const cities = await Promise.all(getCitiesPromises)

      this.cities = cities
    },
    onCountryChange(selectedCountry) {
      this.country = selectedCountry
    },
    onCityChange(selectedCity) {
      this.city = selectedCity
    }
  }
}
</script>

<style lang="scss" scoped>
.on-hover {
  cursor: pointer;
}
</style>
