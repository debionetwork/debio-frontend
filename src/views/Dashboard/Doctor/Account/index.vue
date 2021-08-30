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
              <div class="secondary--text text-h6">
                <b>Doctor Account Information</b>
              </div>
              <v-container v-if="image" class="mb-10 mt-5">
                  <img :src="image" class="rounded-xl" min-width="150" height="150" />
              </v-container>
              <v-form ref="form">
                <v-file-input
                  dense
                  label="Profile Image"
                  placeholder="Profile Image"
                  prepend-icon="mdi-image"
                  outlined
                  v-model="files"
                  @change="fileUploadEventListener"
                  :rules="rules"
                  required
                  show-size
                ></v-file-input>

                <v-text-field
                  dense
                  label="Email"
                  placeholder="Email"
                  outlined
                  v-model="email"
                  :rules="emailRules"
                ></v-text-field>
                
                <v-text-field
                  dense
                  label="Doctor Name"
                  placeholder="Doctor Name"
                  outlined
                  v-model="doctorName"
                  :rules="[val => !!val || 'Name is Required']"
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
                  :rules="[val => !!val || 'Country is Required']"
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
                  :rules="[val => !!val || 'Region is Required']"
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
                  :rules="[val => !!val || 'City is Required']"
                ></v-autocomplete>
                
                <v-text-field
                  dense
                  label="Address"
                  placeholder="Address"
                  outlined
                  v-model="address"
                  :rules="[val => !!val || 'Address is Required']"
                ></v-text-field>

                <v-btn
                  color="primary"
                  block
                  large
                  :loading="isLoading"
                  @click="updateDoctor"
                >Submit</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
          
          <DoctorCertification />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateDoctor } from '@/lib/polkadotProvider/command/doctors'
import countryData from "@/assets/json/country.json"
import { upload } from "@/lib/ipfs"
import cityData from "@/assets/json/city.json"
import DoctorCertification from './Certification'

export default {
  name: 'DoctorAccount',
  components: {
    DoctorCertification,
  },
  async mounted() {
    const doctorInfo = this.doctorAccount.info
    this.email = doctorInfo.email
    this.doctorName = doctorInfo.name
    this.address = doctorInfo.address
    this.image = doctorInfo.profile_image
    
    await this.getCountries()
    this.country = doctorInfo.country
    this.regions = Object.entries(cityData[doctorInfo.country].divisions)
    this.cities = Object.entries(cityData[doctorInfo.country].divisions)
    this.region = doctorInfo.city
    this.city = doctorInfo.city

    if(this.image){
      const res = await fetch(this.image)
      const blob = await res.blob() // Gets the response and returns it as a blob
      const file = new File([blob], this.image.substring(21), {type: "image/jpg"})
      this.files = file
    }
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
    image: "",
    files: [],
    isLoading: false,
    isUploading: false
  }),
  computed: {
    ...mapGetters({
      api: 'substrate/getAPI',
      pair: 'substrate/wallet',
      doctorAccount: 'substrate/doctorAccount',
    }),

    rules(){
      return [
        file => !!file || 'Image is Required',
        file => !file || file.type == 'image/jpg' || file.type == 'image/jpeg' || 'Document type should be image/jpg',
        file => !file || file.size <= 3_097_152 || 'Document size should be less than 3 MB!',
      ]
    },

    emailRules(){
      return [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ]
    }
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
      if (!this.$refs.form.validate()) {
        return
      }
      try{
        this.isLoading = true
        await updateDoctor(
          this.api,
          this.pair,
          {
            name: this.doctorName,
            email: this.email,
            profile_image: this.image,
            address: this.address,
            country: this.country,
            city: this.city,
          },
          () => {
            this.isLoading = false
          }
        )
      }
      catch(err){
        console.error(err)
      }
    },
    
    fileUploadEventListener(file) {
      if (!this.$refs.form.validate()) {
        return
      }
      if (file) {
        if (file.name.lastIndexOf('.') <= 0) {
          return
        }
        this.isUploading = true
        this.isLoading = true
        
        const fr = new FileReader()
        fr.readAsArrayBuffer(file)

        const context = this
        fr.addEventListener('load', async () => {
          // Upload
          const uploaded = await upload({
            fileChunk: fr.result,
            fileType: file.type,
            fileName: file.name,
          })
          context.image = `https://ipfs.io/ipfs/${uploaded.ipfsPath[0].data.path}` // this is an image file that can be sent to server...
          context.isUploading = false
          context.isLoading = false
        })
      }
      else {
        this.files = []
        this.image = ''
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.on-hover {
  cursor: pointer;
}
</style>
