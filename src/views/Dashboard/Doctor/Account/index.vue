<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" xl="8" lg="8" md="8" order-md="1" order="2">
          <!-- <v-card class="dg-card mb-10" elevation="0" outlined>
            <div class="secondary--text mt-5 ml-8"><b>Your Account is not verified</b></div>
            <v-card-text class="px-8">
                <p class="black--text">
                    We recommend that you go through the doctor verification process in order to receive the verified badge
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
          </v-card> -->

          <v-card class="dg-card" elevation="0" outlined>
            <v-card-text class="px-8 mt-5">
              <div class="secondary--text mb-10 h6">
                <b>Doctor Account Information</b>
              </div>

              <v-file-input
                dense
                label="Profile Image"
                placeholder="Profile Image"
                prepend-icon="mdi-image"
                outlined
                v-model="files"
              ></v-file-input>

              <v-text-field
                dense
                label="Email"
                placeholder="Email"
                outlined
                v-model="email"
              ></v-text-field>
              
              <v-text-field
                dense
                label="Doctor Name"
                placeholder="Doctor Name"
                outlined
                v-model="doctorName"
              ></v-text-field>

              <v-autocomplete
                dense
                :items="countries"
                item-text="name"
                item-value="alpha-2"
                @change="onCountryChange"
                label="Select Country"
                v-model="country"
                outlined
              ></v-autocomplete>

              <v-autocomplete
                dense
                :items="regions"
                item-text="1"
                item-value="0"
                @change="onRegionChange"
                label="Select Region"
                :disabled="!country"
                v-model="region"
                outlined
              ></v-autocomplete>

              <v-autocomplete
                dense
                :items="cities"
                item-text="1"
                item-value="0"
                @change="onCityChange"
                label="Select City"
                :disabled="!region"
                v-model="city"
                outlined
              ></v-autocomplete>
              
              <v-text-field
                dense
                label="Address"
                placeholder="Address"
                outlined
                v-model="address"
                ></v-text-field>

                <v-btn
                  color="primary"
                  block
                  large
                  @click="updateDoctor"
                >Submit</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateDoctor } from '@/lib/polkadotProvider/command/doctors'
import countryData from "@/assets/json/country.json"
import cityData from "@/assets/json/city.json"

export default {
  name: 'DoctorAccount',
  async mounted() {
    const doctorInfo = this.doctorAccount.info
    this.email = doctorInfo.email
    this.doctorName = doctorInfo.name
    this.address = doctorInfo.address
    
    await this.getCountries()
    this.country = doctorInfo.country
    this.regions = Object.entries(cityData[doctorInfo.country].divisions)
    this.cities = Object.entries(cityData[doctorInfo.country].divisions)
    this.region = doctorInfo.city
    this.city = doctorInfo.city
  },
  data: () => ({
    email: "",
    doctorName: "",
    address: "",
    country: "",
    region: "",
    city: "",
    countries: [],
    regions: [],
    cities: [],
    files: [],
  }),
  computed: {
    ...mapGetters({
      api: 'substrate/getAPI',
      pair: 'substrate/wallet',
      doctorAccount: 'substrate/doctorAccount',
    }),
    citiesSelection() {
      return this.cities
        .filter((c) => c.country == this.country)
        .map((c) => ({ value: c.city, text: c.city, country: c.country }));
    },
  },
  methods: {
    async getCountries() {
      this.countries = countryData;
    },
    onCountryChange(selectedCountry) {
      this.country = selectedCountry;
      this.regions = Object.entries(cityData[this.country].divisions);
    },
    onRegionChange(selectedRegion) {
      this.region = selectedRegion;
      this.cities = Object.entries(cityData[this.country].divisions);
    },
    onCityChange(selectedCity) {
      this.city = selectedCity;
    },
    async updateDoctor(){
      try{
        await updateDoctor(
          this.api,
          this.pair,
          {
            name: this.doctorName,
            email: this.email,
            address: this.address,
            country: this.country,
            city: this.city,
          }
        )
      }
      catch(err){
        console.error(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.on-hover {
  cursor: pointer;
}
</style>