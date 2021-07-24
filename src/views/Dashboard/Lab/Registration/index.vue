<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" xl="8" lg="8" md="8" order-md="1" order="2">
          <v-card class="dg-card" elevation="0" outlined>
            <v-card-text class="px-8 mt-5">
              <v-form>
              <v-text-field
                dense
                label="Email"
                placeholder="Email"
                autocomplete="new-password"
                outlined
                v-model="email"
                ></v-text-field>
              
              <v-text-field
                dense
                label="Lab Name"
                placeholder="Lab Name"
                autocomplete="new-password"
                outlined
                v-model="labName"
                ></v-text-field>

              <v-autocomplete
                dense
                :items="countries"
                item-text="name"
                item-value="code"
                @change="onCountryChange"
                autocomplete="new-password"
                label="Select Country"
                outlined
              ></v-autocomplete>

              <v-autocomplete
                dense
                :items="regions"
                item-text="name"
                item-value="code"
                @change="onRegionChange"
                autocomplete="new-password"
                label="Select Region"
                :disabled="!country"
                outlined
              ></v-autocomplete>

              <v-autocomplete
                dense
                :items="cities"
                item-text="name"
                item-value="code"
                @change="onCityChange"
                autocomplete="new-password"
                label="Select City"
                :disabled="!region"
                outlined
              ></v-autocomplete>
              
              <v-text-field
                dense
                label="Address"
                placeholder="Address"
                autocomplete="new-password"
                outlined
                v-model="address"
                ></v-text-field>
                
              <!--
              <v-file-input
                dense
                label="Profile Image"
                placeholder="Profile Image"
                prepend-icon="mdi-image"
                outlined
                v-model="files"
                ></v-file-input>
              -->

                <v-btn
                  color="primary"
                  block
                  large
                  @click="registerLab"
                >Submit</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { registerLab } from '@/lib/polkadotProvider/command/labs'
import { setEthAddress } from '@/lib/polkadotProvider/command/userProfile'
import { getWalletAddress } from '@/lib/metamask/wallet'
import Kilt from '@kiltprotocol/sdk-js'
import { u8aToHex } from '@polkadot/util'
import { getLocation } from "@/lib/api"


export default {
  name: 'LabRegistration',
  data: () => ({
    country: "",
    region: "",
    city: "",
    countries: [],
    cities: [],
    regions: [],
    email: "",
    labName: "",
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
      labAccount: 'substrate/labAccount',
      isLabAccountExist: 'substrate/isLabAccountExist',
    }),
    ...mapState({
      locationContract: state => state.ethereum.contracts.contractLocation,
      degenicsContract: state => state.ethereum.contracts.contractDegenics,
      mnemonic: state => state.substrate.mnemonicData.mnemonic,
      countryData: state => state.auth.countryData,
      
    }),
    citiesSelection() {
      return this.cities
        .filter((c) => c.country == this.country)
        .map((c) => ({ value: c.city, text: c.city, country: c.country }));
    },
    selectedLab() {
      if (!this.labAccount) {
        return;
      }
      return this.labs.filter((l) => l.labAccount == this.labAccount)[0];
    },
  },
  methods: {
    setLabAccount(labAccount) {
      this.$store.state.substrate.labAccount = labAccount
      this.$store.state.substrate.isLabAccountExist = true
    },
    async getCountries() {
      this.countries = this.countryData;
    },
    async onCountryChange(selectedCountry) {
      this.country = selectedCountry;
      this.regions = await getLocation(this.country, null);
    },
    async onRegionChange(selectedRegion) {
      this.region = selectedRegion;
      this.cities = await getLocation(this.country, this.region);
    },
    onCityChange(selectedCity) {
      this.city = selectedCity;
    },
    getKiltBoxPublicKey() {
      const cred = Kilt.Identity.buildFromMnemonic(this.mnemonic)
      return u8aToHex(cred.boxKeyPair.publicKey)
    },
    async registerLab(){
      try{
        const ethAddress = await getWalletAddress()
        const box_public_key = this.getKiltBoxPublicKey()
        await registerLab(
          this.api,
          this.pair,
          {
            box_public_key,
            name: this.labName,
            email: this.email,
            address: this.address,
            country: this.country.trim(),
            region: this.region.trim(),
            city: this.city.trim(),
          }
        )
        
        await setEthAddress(
          this.api,
          this.pair,
          ethAddress
        )
        
        const labAccount = {
          account_id: this.pair.address,
          services: [],
          certifications: [],
          info: {
            box_public_key,
            name: this.labName,
            email: this.email,
            address: this.address,
            country: this.country.trim(),
            city: this.city.trim(),
            region: this.region.trim(),
          }
        }
        this.setLabAccount(labAccount)
        this.$router.push('/lab')
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
