<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" xl="8" lg="8" md="8" order-md="1" order="2">
          <v-card class="dg-card" elevation="0" outlined>
            <v-card-text class="px-8 mt-5">
              <v-form
                lazy-validation
                ref="doctorForm">
                <v-text-field
                  dense
                  label="Email"
                  placeholder="Email"
                  autocomplete="new-password"
                  outlined
                  v-model="email"
                  :rules="emailRules"
                  ></v-text-field>
                
                <v-text-field
                  dense
                  label="Doctor Name"
                  placeholder="Doctor Name"
                  autocomplete="new-password"
                  outlined
                  v-model="doctorName"
                  :rules="nameRules"
                  ></v-text-field>

                <v-autocomplete
                  dense
                  :items="countries"
                  item-text="name"
                  item-value="alpha-2"
                  @change="onCountryChange"
                  autocomplete="new-password"
                  label="Select Country"
                  outlined
                  :rules="[val => !!val || 'This field is required']"
                ></v-autocomplete>

                <v-autocomplete
                  dense
                  :items="regions"
                  item-text="1"
                  item-value="0"
                  @change="onRegionChange"
                  autocomplete="new-password"
                  label="Select State/Province"
                  :disabled="!country"
                  outlined
                  :rules="[val => !!val || 'This field is required']"
                ></v-autocomplete>

                <v-autocomplete
                  dense
                  :items="cities"
                  item-text="1"
                  item-value="0"
                  @change="onCityChange"
                  autocomplete="new-password"
                  label="Select City"
                  :disabled="!region"
                  outlined
                  :rules="[val => !!val || 'This field is required']"
                ></v-autocomplete>

                <v-text-field
                  dense
                  label="Address"
                  placeholder="Address"
                  autocomplete="new-password"
                  outlined
                  v-model="address"
                  :rules="addressRules"
                  ></v-text-field>


                <v-file-input
                  dense
                  label="Profile Image"
                  placeholder="Profile Image"
                  prepend-icon="mdi-image"
                  autocomplete="new-password"
                  outlined
                  v-model="files"
                  @change="fileUploadEventListener"
                  :rules="fileInputRules"
                  accept="image/png, image/jpeg"
                ></v-file-input>

                <v-btn
                  color="primary"
                  block
                  large
                  :disabled="isUploading"
                  :loading="isLoading"
                  @click="registerDoctor"
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
import { mapGetters } from "vuex"
import { registerDoctor } from "@/lib/polkadotProvider/command/doctors"
import { setEthAddress } from "@/lib/polkadotProvider/command/userProfile"
import { getWalletAddress } from "@/lib/metamask/wallet"
import countryData from "@/assets/json/country.json"
import cityData from "@/assets/json/city.json"
import { upload } from "@/lib/ipfs"

export default {
  name: "DoctorRegistration",
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
    image: "",
    files: [],
    isLoading: false,
    isUploading: false,
  }),
  async mounted() {
    await this.getCountries();
  },
  computed: {
    ...mapGetters({
      api: "substrate/getAPI",
      pair: "substrate/wallet",
      doctorAccount: "substrate/doctorAccount",
      isDoctorAccountExist: "substrate/isDoctorAccountExist",
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
    emailRules() {
      return [
        val => !!val || 'This field is required',
        val => /.+@.+\..+/.test(val) || 'Email is invalid. It should contain @ followed by a domain',
      ]
    },
    nameRules() {
      return [
        val => !!val || 'This field is required',
      ]
    },
    addressRules() {
      return [
        val => !!val || 'This field is required',
        val => (val && val.length <= 180) || 'This field only allows 180 characters'
      ]
    },
    fileInputRules() {
      return [
        value => !value || value.size < 2000000 || 'The total file size uploaded exceeds the maximum file size allowed (2MB)',
      ]
    },
  },
  methods: {
    setDoctorAccount() {
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
      if (!this.validating()) {
        return
      }
      try{
        this.isLoading = true
        const ethAddress = await getWalletAddress()
        await setEthAddress(
          this.api,
          this.pair,
          ethAddress,
          async () => {
            await registerDoctor(
              this.api,
              this.pair,
              {
                name: this.doctorName,
                email: this.email,
                profileImage: this.image,
                address: this.address,
                country: this.country,
                city: this.city,
              },
              async () => {
                this.setDoctorAccount()
                this.isLoading = false
                this.$router.push("/doctor")
              }
            )
          }
        )
      }
      catch(e){
        console.error(e)
      }
    },
    fileUploadEventListener(file) {
      this.isUploading = true
      this.isLoading = true
      if (file) {
        if (file.name.lastIndexOf(".") <= 0) {
          return
        }
        const fr = new FileReader()
        fr.readAsArrayBuffer(file)

        const context = this
        fr.addEventListener("load", async () => {
          // Upload
          const uploaded = await upload({
            fileChunk: fr.result,
            fileType: file.type,
            fileName: file.name,
          })
          const computeLink = `${uploaded.ipfsPath[0].data.ipfsFilePath}/${uploaded.fileName}`

          context.image = `https://ipfs.io/ipfs/${computeLink}` // this is an image file that can be sent to server...
          context.isUploading = false
          context.isLoading = false
        })
      }
      else {
        this.files = []
        this.image = ""
      }
    },

    validating() {
      if (this.doctorName == "" || this.email == "" || this.image == "" || this.address == "" || this.country == "" || this.city == "") {
        this.$refs.doctorForm.validate()
        return false
      }
      return true
    },
  }
}
</script>

<style lang="scss" scoped>
.on-hover {
  cursor: pointer;
}
</style>
