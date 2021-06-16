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
                outlined
              ></v-autocomplete>
              
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
                v-model="files"
                ></v-file-input>

                <v-btn
                  color="primary"
                  block
                  large
                  @click="registerDoctor"
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
import { queryDoctorsById } from '@/lib/polkadotProvider/query/doctors'
import { registerDoctor } from '@/lib/polkadotProvider/command/doctors'
import { setEthAddress } from '@/lib/polkadotProvider/command/userProfile'
import { getWalletAddress } from '@/lib/metamask/wallet'
import countryData from "@/assets/json/country.json"
import cityData from "@/assets/json/city.json"

export default {
  name: 'DoctorRegistration',
  data: () => ({
    country: "",
    region: "",
    city: "",
    countries: [],
    cities: [],
    regions: [],
    email: "",
    doctorName: "",
    address: "",
    files: [],
  }),
  async mounted() {
    await this.getCountries();
  },
  computed: {
    ...mapGetters({
      api: 'substrate/getAPI',
      pair: 'substrate/wallet',
      doctorAccount: 'substrate/doctorAccount',
      isDoctorAccountExist: 'substrate/isDoctorAccountExist',
    }),
    ...mapState({
      locationContract: state => state.ethereum.contracts.contractLocation,
      degenicsContract: state => state.ethereum.contracts.contractDegenics,
    }),
    citiesSelection() {
      return this.cities
        .filter((c) => c.country == this.country)
        .map((c) => ({ value: c.city, text: c.city, country: c.country }));
    },
    selectedDoctor() {
      if (!this.doctorAccount) {
        return;
      }
      return this.doctors.filter((l) => l.doctorAccount == this.doctorAccount)[0];
    },
  },
  methods: {
    setDoctorAccount(doctorAccount) {
      this.$store.state.substrate.doctorAccount = doctorAccount
      this.$store.state.substrate.isDoctorAccountExist = true
    },
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
    async registerDoctor(){
      try{
        const ethAddress = await getWalletAddress()
        await registerDoctor(
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
        
        await setEthAddress(
          this.api,
          this.pair,
          ethAddress
        )
        
        const doctorAccount = await queryDoctorsById(this.api, this.pair.address)
        this.setDoctorAccount(doctorAccount)
        this.$router.push('/doctor')
      }
      catch(e){
        console.error(e)
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
