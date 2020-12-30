<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="text-h5 px-2 secondary--text text--lighten-2">
            <b>Request a Test</b>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xl="6" lg="8" md="8" order-md="1" order="2">
          <v-card class="dg-card" elevation="0" outlined>
            <v-card-title class="px-8">
              <div class="text-h6">
                Select a Lab
              </div>
            </v-card-title>
            <v-card-text class="px-8">
              <v-select
                dense
                :items="selections.countries"
                :value="country"
                @change="onCountryChange"
                label="Select Country"
                outlined
              ></v-select>

              <v-select
                dense
                :items="selections.cities"
                :value="city"
                @change="onCityChange"
                label="Select City"
                :disabled="!country"
                outlined
              ></v-select>

              <v-select
                dense
                :items="selections.labs"
                :value="labId"
                @change="onLabChange"
                menu-props="auto"
                label="Select Lab"
                :disabled="!city"
                outlined
              ></v-select>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" xl="3" lg="4" md="4" order-md="2" order="1">
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

      <template v-if="labId">
        <v-row class="mt-4">
          <v-col cols="12">
            <div class="px-2">
              <div class="text-h5 secondary--text text--lighten-2">
                <b>Select Products</b>
              </div>
              <div class="mt-2 text-h6">
                <b>{{ selectedLab.text }}</b>
              </div>
              <div>
                Available Products
              </div>
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col
            v-for="(product) in selections.products"
            :key="product.title"
            cols="12" xl="3" lg="4" md='4'
            :class="$vuetify.breakpoint.smAndDown ? 'py-0' : 'py-1'"
          >
            <SelectableMenuCard
              :icon="product.icon"
              :title="product.title"
              :sub-title="product.description"
              :is-selected="isProductSelected(product)"
              @click="selectProduct(product)"
            ></SelectableMenuCard>
          </v-col>
        </v-row>

        <v-row justify="center" class="mt-2">
          <v-col cols="12" md="4">
            <v-btn
              depressed
              color="primary"
              large
              width="100%"
              @click="onContinue"
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
import { mapMutations, mapState } from 'vuex'
import SelectableMenuCard from '../../../components/SelectableMenuCard'

export default {
  components: {
    SelectableMenuCard,
  },
  computed: {
    selectedLab() {
      return this.labId
        ? this.selections.labs.find(l => l.value == this.labId) 
        : { text: '' }
    },
    ...mapState({
      cart: state => state.cart,
    }),
    country: {
      get() {
        return this.cart.lab.country
      },
      set(val) {
        this.setLab({ ...this.cart.lab, country: val })
      }
    },
    city: {
      get() {
        return this.cart.lab.city
      },
      set(val) {
        this.setLab({ ...this.cart.lab, city: val })
      }
    },
    labId: {
      get() {
        return this.cart.lab.id
      },
    },
    labName: {
      get() {
        return this.cart.lab.name
      },
    },
    products: {
      get() {
        return this.cart.products
      },
      set(val) {
        this.setProducts(val)
      }
    }
  },
  data: () => ({
    // TODO: Get city selection based on selected country from smart contract
    // TODO: Get lab selection based on selected city from smart contract
    // TODO: Get Product selection based on selected lab from smart contract
    selections: {
      countries: [
        { value: 'id', text: 'Indonesia' },
        { value: 'us', text: 'United States' },
      ],
      cities: [
        { value: 'jakarta', text: 'Jakarta' },
        { value: 'bandung', text: 'Bandung' },
      ],
      labs: [
        { value: 'a', text: 'Lab A', walletAddress: '0x8274Ad69e8657D8B8b710A14b52C4A0E39316ccc' },
        { value: 'b', text: 'Lab B', walletAddress: '0x8274Ad69e8657D8B8b710A14b52C4A0E39316ccc' },
        { value: 'c', text: 'Lab C', walletAddress: '0x8274Ad69e8657D8B8b710A14b52C4A0E39316ccc'},
        { value: 'd', text: 'Lab D', walletAddress: '0x8274Ad69e8657D8B8b710A14b52C4A0E39316ccc' },
      ],
      products: [
        { title: 'Covid-19', description: 'Get tested for Covid-19 immunity', icon: 'mdi-virus', price: 10 },
        { title: 'Exercise', description: 'Exercise recommendation based on your genes', icon: 'mdi-weight-lifter', price: 10 },
        { title: 'Diet', description: 'Diet recommendation based on your genes', icon: 'mdi-food-apple', price: 10 },
        { title: 'Genetic Traits', description: 'Get to know what\'s in your genes' , icon: 'mdi-dna', price: 10 },
        { title: 'Supplement', description: 'Supplement recommendation based on your genes', icon: 'mdi-pill', price: 10 },
        { title: 'Ancestry', description: 'Ancestry information from your genes', icon: 'mdi-family-tree', price: 10 },
        { title: 'Skin', description: 'Skin traits information from your genes', icon: '$dgi-skin', price: 10 },
      ]
    }
  }),
  methods: {
    onCountryChange(selectedCountry) {
      this.country = selectedCountry
    },
    onCityChange(selectedCity) {
      this.city = selectedCity
    },
    onLabChange(selectedLabId) {
      const selectedLab = this.selections.labs.filter(l => l.value == selectedLabId)[0]
      const { value, text, walletAddress } = selectedLab
      this.setLab({
        country: this.country,
        city: this.city,
        id: value,
        name: text,
        walletAddress
      })
    },
    isProductSelected(product) {
      return this.products.filter(p => p.title == product.title).length > 0
    },
    selectProduct(product) {
      if (_.includes(this.products, product)) {
        this.products = this.products.filter(p => p.title != product.title)
        return
      }
      this.products = [...this.products, product]
    },
    ...mapMutations({
      setLab: 'cart/SET_LAB',
      setProducts: 'cart/SET_PRODUCTS',
    }),
    onContinue() {
      this.$router.push({ name: 'request-test-checkout', })
    }
  }
}
</script>

<style lang="scss">

</style>
