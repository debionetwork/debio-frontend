<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" xl="8" lg="8" md="8" order-md="1" order="2">
          <v-card class="dg-card" elevation="0" outlined>
            <v-card-title class="px-8">
              <div class="text-h6">
                Select a Lab
              </div>
            </v-card-title>
            <v-card-text class="px-8">
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

              <v-select
                dense
                :items="labsSelection"
                :value="labAccount"
                @change="onLabChange"
                menu-props="auto"
                label="Select Lab"
                :disabled="!city"
                outlined
              ></v-select>
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
                Please select a lab that is as close to your location as possible.
              </div>
              <div>
                You need to do this because dna samples have limited shelf life.
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <div v-if="isLoadingProducts" class="d-flex justify-center mt-10">
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </div>

      <template v-if="labAccount && !isLoadingProducts">
        <v-row class="mt-4">
          <v-col cols="12">
            <div class="px-2">
              <div class="text-h5 secondary--text text--lighten-2">
                <b>{{ selectedLab.name }}</b>
              </div>
              <div class="mt-2 text-h6">
                <b>Select Product</b>
              </div>
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col
            v-for="(product) in productsSelection"
            :key="product.serviceName"
            cols="12" xl="3" lg="4" md='4'
            :class="$vuetify.breakpoint.smAndDown ? 'py-0' : 'py-1'"
          >
            <SelectableMenuCard
              :icon="product.icon"
              :title="product.serviceName"
              :sub-title="product.description"
              :is-selected="isProductSelected(product)"
              :disabled="isProductDisabled(product)"
              @click="selectOneProduct(product)"
            ></SelectableMenuCard>
          </v-col>
        </v-row>

        <v-row justify="center" class="mt-2">
          <v-col cols="12">
            <v-btn
              depressed
              color="primary"
              x-large
              width="100%"
              :disabled="selectedProducts.length == 0"
              @click="onContinue"
              height="64"
            >
              Continue
            </v-btn>
          </v-col>
        </v-row>
      </template>
    </v-container>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState, mapMutations } from 'vuex'
import SelectableMenuCard from '@/components/SelectableMenuCard'

export default {
  name: 'RequestTest',
  components: {
    SelectableMenuCard,
  },
  async mounted() {
    await this.getCountries()
    await this.getCities()
    await this.getLabs()
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
    },
    labsSelection() {
      return this.labs
        .filter(lab => lab.country == this.country && lab.city == this.city)
        .map(lab => ({ value: lab.labAccount, text: lab.name }))
    },
    productsSelection() {
      return this.products
        .map(prod => {
          try {
            const additionalData = JSON.parse(prod.additionalData)
            return { ...prod, ...additionalData }
          } catch (err) {
            return prod
          }
        })
    },
    selectedLab() {
      if (!this.labAccount) { return }
      return this.labs.filter(l => l.labAccount == this.labAccount)[0]
    }
  },
  data: () => ({
    country: '',
    city: '',
    labAccount: '',
    selectedProducts: [],
    isLoadingProducts: false,
    countries: [],
    cities: [],
    labs: [],
    products: [],
  }),
  methods: {
    ...mapMutations({
      setLabToRequest: 'testRequest/SET_LAB',
      setProductsToRequest: 'testRequest/SET_PRODUCTS'
    }),
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
    async getLabs() {
      if (!this.cities) { return }

      const getLabsPromises = []
      for (let cityObj of this.cities) {
        const { country, city } = cityObj
        const labCount = await this.degenicsContract.methods.labCount(country, city).call()

        for (let i = 1; i <= labCount; i++) {
          const promise = this.degenicsContract.methods
            .labByIndex(country, city, i).call()
            .then(lab => {
              try {
                const additionalData = JSON.parse(lab['additionalData'])
                return { ...lab, ...additionalData }
              } catch (err) {
                return lab
              }
            })
          
          getLabsPromises.push(promise)
        }
      }

      const labs = await Promise.all(getLabsPromises)

      this.labs = labs
    },
    async getLabProducts() {
      this.isLoadingProducts = true

      try {
        const serviceCount = await this.degenicsContract.methods.serviceCount(this.labAccount).call()     
        const getServicePromises = []
        for (let i = 1; i <= serviceCount; i++) {
          const promise = await this.degenicsContract.methods.serviceByIndex(this.labAccount, i).call()
          getServicePromises.push(promise)
        }

        const services = await Promise.all(getServicePromises)

        this.products = services
      } catch (err) {
        this.products = []
      }

      this.isLoadingProducts = false
    },
    onCountryChange(selectedCountry) {
      this.country = selectedCountry
    },
    onCityChange(selectedCity) {
      this.city = selectedCity
    },
    async onLabChange(labAccount) {
      this.labAccount = labAccount
      await this.getLabProducts()
    },
    isProductSelected(product) {
      return this.selectedProducts.filter(p => p.code == product.code).length > 0
    },
    isProductDisabled(product) {
      if (this.selectedProducts.length == 0) {
        return false
      }
      return this.selectedProducts[0].code != product.code
    },
    selectProduct(product) {
      // deselect
      if (_.includes(this.selectedProducts, product)) {
        this.selectedProducts = this.selectedProducts.filter(p => p.code != product.code)
        return
      }
      // select
      this.selectedProducts = [...this.selectedProducts, product]
    },
    selectOneProduct(product) {
      if (this.selectedProducts.length == 0) {
        this.selectedProducts = [product]
        return
      }
      if (this.selectedProducts.length > 0 && this.selectedProducts[0].code == product.code) {
        this.selectedProducts = []
      }
    },
    onContinue() {
      this.setLabToRequest(this.selectedLab)
      this.setProductsToRequest(this.selectedProducts)
      this.$router.push({ name: 'request-test-checkout', })
    }
  }
}
</script>

<style lang="scss">

</style>
