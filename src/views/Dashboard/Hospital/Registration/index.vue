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
                label="Hospital Name"
                placeholder="Hospital Name"
                outlined
                v-model="hospitalName"
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
                  @click="registerHospital"
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
import { queryHospitalsById } from '@/lib/polkadotProvider/query/hospitals'
import { registerHospital } from '@/lib/polkadotProvider/command/hospitals'
import { setEthAddress } from '@/lib/polkadotProvider/command/userProfile'
import { getWalletAddress } from '@/lib/metamask/wallet'
import countryData from "@/assets/json/country.json"
import cityData from "@/assets/json/city.json"

export default {
  name: 'HospitalRegistration',
  data: () => ({
    country: "",
    region: "",
    city: "",
    countries: [],
    cities: [],
    regions: [],
    email: "",
    hospitalName: "",
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
      hospitalAccount: 'substrate/hospitalAccount',
      isHospitalAccountExist: 'substrate/isHospitalAccountExist',
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
    selectedHospital() {
      if (!this.hospitalAccount) {
        return;
      }
      return this.hospitals.filter((l) => l.hospitalAccount == this.hospitalAccount)[0];
    },
  },
  methods: {
    setHospitalAccount(hospitalAccount) {
      this.$store.state.substrate.hospitalAccount = hospitalAccount
      this.$store.state.substrate.isHospitalAccountExist = true
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
    async registerHospital(){
      try{
        const ethAddress = await getWalletAddress()
        await registerHospital(
          this.api,
          this.pair,
          {
            name: this.hospitalName,
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
        
        const hospitalAccount = await queryHospitalsById(this.api, this.pair.address)
        this.setHospitalAccount(hospitalAccount)
        this.$router.push('/hospital')
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
