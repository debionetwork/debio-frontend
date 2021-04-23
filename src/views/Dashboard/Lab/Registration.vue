<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" xl="8" lg="8" md="8" order-md="1" order="2">
          <v-card class="dg-card" elevation="0" outlined>
            <v-card-text class="px-8 mt-5">
              <v-text-field
                dense
                label="Email"
                placeholder="Email"
                outlined
                v-model="email"
                ></v-text-field>
              
              <v-text-field
                dense
                label="Lab Name"
                placeholder="Lab Name"
                outlined
                v-model="labName"
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
                v-model="address"
                ></v-text-field>
                
              
              <v-file-input
                dense
                label="Profile Image"
                placeholder="Profile Image"
                prepend-icon="mdi-image"
                outlined
                v-model="profileImage"
                ></v-file-input>

                <v-btn
                  color="primary"
                  block
                  large
                  @click="registerLab"
                >Submit</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { registerLab } from '@/lib/polkadotProvider/command/labs';

export default {
  name: 'LabRegistration',
  data: () => ({
    email: "",
    labName: "",
    address: "",
    profileImage: "",
    country: "",
    city: "",
    countries: [],
    cities: [],
  }),
  async mounted() {
    // await this.getCountries()
    // await this.getCities()
  },
  computed: {
    ...mapGetters({
      api: 'substrate/getAPI',
      pair: 'substrate/wallet',
    }),
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
    },
    registerLab(){
      registerLab(
        this.api,
        this.pair,
        {
          name: this.labName,
          address: this.address,
          country: this.country,
          city: this.city,
        }
      )
      .then((address) => {
        alert(address)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.on-hover {
  cursor: pointer;
}
</style>
