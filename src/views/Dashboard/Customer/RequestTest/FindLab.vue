<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" xl="8" lg="8" md="8" order-md="1" order="2">
          <v-card class="dg-card" elevation="0" outlined>
            <v-card-title class="px-8">
              <div class="text-h6">Select a Lab</div>
            </v-card-title>
            <v-card-text class="px-8">
              <v-autocomplete
                dense
                v-model="country"
                :key="country"
                :items="countries"
                item-text="name"
                item-value="alpha-2"
                @change="onCountryChange"
                label="Select Country"
                autocomplete="disabled"
                :disabled="showRequestNoLab"
                outlined
              ></v-autocomplete>

              <v-autocomplete
                dense
                v-model="region"
                :key="region"
                :items="regions"
                item-text="1"
                item-value="0"
                @change="onRegionChange"
                label="Select Region"
                :disabled="country == 'country' || showRequestNoLab"
                autocomplete="disabled"
                outlined
              ></v-autocomplete>

              <v-autocomplete
                dense
                v-model="city"
                :key="city"
                :items="cities"
                item-text="1"
                item-value="0"
                @change="onCityChange"
                label="Select City"
                :disabled="region == 'region' || showRequestNoLab"
                autocomplete="disabled"
                outlined
              ></v-autocomplete>

              <v-select  v-if="!showRequestNoLab"
                dense
                :items="labs"
                item-value="labData"
                item-text="labName"
                @change="onLabChange"
                menu-props="auto"
                :label="noLab"
                :disabled="city == 'city' || showRequestNoLab"
                autocomplete="disabled"
                outlined
              >
                <template slot='item' slot-scope='{ item }'>
                  <v-list-tile-content>
                    <v-list-tile-title>
                      {{item.labName}}
                    </v-list-tile-title>
                    <v-list-tile-sub-title 
                      class="d-flex justify-start ms-8 grey--text"
                      flat
                    >
                    {{item.address}}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </template>
              </v-select>
              <v-select v-if="showRequestNoLab"
                dense
                :items="listCategories"
                label="Select Test / Category"
                @change="onCategoryChange"
                menu-props="auto"
                autocomplete="disabled"
                outlined
              >
              </v-select>
              <v-text-field v-if="showSpecify"
                @input="category"
                label="Please Specify..."
                outlined
              >
              </v-text-field>
            </v-card-text>
            <div
              class="ml-8 mr-8 mb-8 grey--text text--darken-1"
              v-if="showNoLab"
            >
              <div>
                <b :style="{'color': 'red' }">There are no lab available in your city.</b> <br><br>

                1. You can request a lab to register to DeBio by clicking the "Request a lab" button. <br><br>
                2. Additionally, you can stake an amount of tokens or regular cirrency(USD), which will be given as an incentive to labs registering in your location. <br><br>
                3. Labs will use the result of this form, filled-in by you and other DeBio users, to evaluate the demand in the area you designated.

              </div>
              <StakingDialog 
              :show="showStakingDialog"
              @toggle="showStakingDialog = $event"
              @close="actionAlert()"           
              />
            </div>
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
                Please select a lab that is as close to your location as
                possible.
              </div>
              <div>
                You need to do this because dna samples have limited shelf life.
              </div>
            </v-card-text>
          </v-card>

          <v-card class="dg-card mt-3" elevation="0">
            <v-card-text>
              <div>
                For demo purposes, available labs are located in
              </div>
              <div>
                <ul>
                  <li>Indonesia -> Jakarta Raya -> Jakarta Raya</li>
                  <li>Malaysia -> Johor -> Johor</li>
                </ul>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <div class="mt-5" v-if="showNoLab">
        <v-row>
          <v-col v-if="isLoadingRequestNoLab" cols="12" lg="12" md="12" sm="12">
            <v-progress-linear
              indeterminate
              color="primary"
            ></v-progress-linear>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="8" md="8" sm="8">
            <v-btn
              v-if="showRequestNoLab"
              depressed
              color="primary"
              large
              :disabled="isLoadingRequestNoLab || category.length == 0"
              width="100%"
              @click="showingStakingDialog"
            >
              Submit
            </v-btn>
            <v-btn
              v-else
              depressed
              color="primary"
              large
              width="100%"
              @click="showRequestNoLab = true"
            >
              Request a Lab
            </v-btn>
          </v-col>
          <v-col cols="12" lg="4" md="4" sm="4">
            <v-btn
              v-if="showRequestNoLab"
              depressed
              color="orange"
              large
              width="100%"
              :disabled="isLoadingRequestNoLab"
              @click="showRequestNoLab = false"
            >
              Cancel
            </v-btn>
          </v-col>
        </v-row>
      </div>
      

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
                <b>{{ labAccount.info.name }}</b>
              </div>
            </div>
          </v-col>
        </v-row>

        <v-row class="mt-2">
          <v-col cols="12" md="8">
            <div class="text-h6 px-2">
              <b>DNA Sample Collection Requirements</b>
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="8">
            <DnaCollectionRequirements />
          </v-col>
        </v-row>

        <v-row class="mt-2">
          <v-col cols="12">
            <div class="px-2">
              <div class="text-h6">
                <b>Select Product</b>
              </div>
            </div>
          </v-col>
        </v-row>

        <v-row class="pt-1">
          <v-col
            v-for="product in products"
            :key="product.serviceData.id"
            cols="12"
            xl="4"
            lg="4"
            md="6"
            :class="$vuetify.breakpoint.smAndDown ? 'py-0' : 'py-1'"
          >
            <SelectableMenuCard
              :icon="product.icon"
              :title="product.serviceName"
              :sub-title="product.serviceData.info.description"
              :hover-text="
                product.serviceData.info.long_description
                  ? product.serviceData.info.long_description
                  : product.serviceData.info.description
              "
              :is-selected="isProductSelected(product)"
              :disabled="isProductDisabled(product)"
              @click="selectOneProduct(product)"
            >
              <template v-slot:footer>
                <span class="text-h6">
                  {{ product.totalPrice }}
                </span>
                <span class="primary--text text-caption">
                  {{ product.currency }}
                </span>
              </template>
            </SelectableMenuCard>
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
            Checkout Order
            </v-btn>
          </v-col>
        </v-row>
      </template>
    </v-container>
  </div>
</template>

<script>
import _ from "lodash";
import { mapState, mapMutations } from "vuex";
import SelectableMenuCard from "@/components/SelectableMenuCard";
import DnaCollectionRequirements from "./DnaCollectionRequirements";
import countryData from "@/assets/json/country.json";
import cityData from "@/assets/json/city.json";
import {
  queryLabsByCountryRegionCity,
  queryLabsById,
} from "@/lib/polkadotProvider/query/labs";
import { queryServicesById } from "@/lib/polkadotProvider/query/services";
import StakingDialog from "./StakingDialog.vue"

export default {
  name: "FindLab",
  components: {
    SelectableMenuCard,
    DnaCollectionRequirements,
    // DialogAlert,
    StakingDialog
  },
  data: () => ({
    country: "country",
    city: "city",
    region: "region",
    labAccount: "",
    selectedProducts: [],
    isLoadingProducts: false,
    countries: [],
    category: "",
    cities: [],
    regions: [],
    labs: [],
    products: [],
    coinName: "",
    listCategories: [],
    showRequestNoLab: false,
    showNoLab: false,
    showSpecify: false,
    requestNoLabItem: [],
    isLoadingRequestNoLab: false,
    dialogAlert: false,
    statusSendReqNoLab: false,
    showStakingDialog: false
  }),
  async mounted() {
    this.coinName = this.configApp.tokenName;
    await this.getCountries();
    this.listCategories = [
      "Bionfarmatics Data Analyst Support", 
      "Genetic Counseling", 
      "Single Nucleotida Polymorphism (SNP) Microarray", 
      "Targeted Gene Panel Sequencing", 
      "Whole-Enome Sequencing", 
      "Whole-Genome Sequencing", 
      "Whole-Transcription Sequencing",
      "Other"
    ];
  },
  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      configApp: (state) => state.auth.configApp,
    }),
    citiesSelection() {
      return this.cities
        .filter((c) => c.country == this.country)
        .map((c) => ({ value: c.city, text: c.city, country: c.country }));
    },
    labsSelection() {
      return this.labs
        .filter((lab) => lab.country == this.country && lab.city == this.city)
        .map((lab) => ({ value: lab.labAccount, text: lab.name }));
    },
    productsSelection() {
      return this.products.map((prod) => {
        try {
          const additionalData = JSON.parse(prod.additionalData);
          return { ...prod, ...additionalData };
        } catch (err) {
          return prod;
        }
      });
    },
    selectedLab() {
      if (!this.labAccount) {
        return;
      }
      return this.labs.filter((l) => l.labAccount == this.labAccount)[0];
    },
    noLab() {
      if (this.showNoLab) {
        return 'There are no available lab'
      } else {
        return 'Select Test Lab'
      }
    }
  },
  methods: {
    ...mapMutations({
      setLabToRequest: "testRequest/SET_LAB",
      setProductsToRequest: "testRequest/SET_PRODUCTS",
    }),
    async getCountries() {
      this.showNoLab = false;
      this.countries = countryData;
    },
    onCountryChange(selectedCountry) {
      this.showNoLab = false;
      this.regions = [];
      this.region = "region";
      this.city = "city";
      this.cities = [];
      this.country = selectedCountry;

      this.regions = Object.entries(cityData[this.country].divisions);
    },
    onRegionChange(selectedRegion) {
      this.showNoLab = false;
      this.city = "city";
      this.cities = [];
      this.region = selectedRegion;
      this.cities = Object.entries(cityData[this.country].divisions);
    },
    onCityChange(selectedCity) {
      this.showNoLab = false;
      this.city = selectedCity;
      this.getLabs();
    },
    async getLabs() {
      if (!this.cities) {
        return;
      }
      this.labAccount = "";
      this.labs = [];
      this.products = [];
      const listLabID = await queryLabsByCountryRegionCity(
        this.api,
        this.country + "-" + this.region,
        this.city
      );
      if (listLabID) {
        for (let i = 0; i < listLabID.length; i++) {
          const detaillab = await queryLabsById(this.api, listLabID[i]);
          if (detaillab) {
            const labName = detaillab.info.name;
            const accountId = detaillab.account_id;
            const address = detaillab.info.address;
            const labData = detaillab;

            const lab = {
              accountId,
              labName,
              address,
              labData,
            };

            this.labs.push(lab);
          }
        }
      }
      if (this.labs.length == 0) {
        this.showNoLab = true;
        this.showRequestNoLab = false;
        this.isLoadingRequestNoLab = false;
        this.requestNoLabItem = [];
      }
    },
    async onLabChange(labAccount) {
      this.labAccount = labAccount;
      await this.getLabProducts();
    },
    async getLabProducts() {
      this.isLoadingProducts = true;
      this.products = [];

      try {
        if (this.labAccount) {
          for (let i = 0; i < this.labAccount.services.length; i++) {
            try {
              const detailService = await queryServicesById(
                this.api,
                this.labAccount.services[i]
              );

              if (detailService) {
                const serviceName = detailService.info.name;
                let icon = "mdi-needle";
                if (detailService.info.image) {
                  icon = detailService.info.image;
                }
                const accountId = this.labAccount.services[i];
                const serviceData = detailService;
                let currency = this.coinName;
                let price = 0;
                let additionalPrices = 0;
                let totalPrice = 0
                if (detailService.info.prices_by_currency != null) {
                  currency = detailService.info.prices_by_currency[0].currency;
                  if (
                    detailService.info.prices_by_currency[0].price_components.length > 0
                  ) {
                    price =
                      detailService.info.prices_by_currency[0].price_components[0].value;
                  }
                  if (
                    detailService.info.prices_by_currency[0].additional_prices
                      .length > 0
                  ) {
                    additionalPrices =
                      detailService.info.prices_by_currency[0]
                        .additional_prices[0].value;
                  }
                  totalPrice = Number(price) + Number(additionalPrices)
                  totalPrice = totalPrice.toString()
                }

                const product = {
                  accountId,
                  serviceName,
                  icon,
                  serviceData,
                  price,
                  currency,
                  additionalPrices,
                  indexPrice: 0,
                  totalPrice,
                };

                this.products.push(product);
              }
            } catch (err) {
              console.log('views/Dashboard/Custumer/RequestTest/FindLab error: ', err)
              continue
            }
          }
        }
      } catch (err) {
        this.products = [];
      }
      this.isLoadingProducts = false;
      console.log(this.products, '<====== productsss')
    },
    isProductSelected(product) {
      return (
        this.selectedProducts.filter(
          (p) => p.serviceData.id == product.serviceData.id
        ).length > 0
      );
    },
    isProductDisabled(product) {
      if (this.selectedProducts.length == 0) {
        return false;
      }
      return this.selectedProducts[0].serviceData.id != product.serviceData.id;
    },
    selectProduct(product) {
      // deselect
      if (_.includes(this.selectedProducts, product)) {
        this.selectedProducts = this.selectedProducts.filter(
          (p) => p.serviceData.id != product.serviceData.id
        );
      }
      // select
      this.selectedProducts = [...this.selectedProducts, product];
    },
    selectOneProduct(product) {
      if (this.selectedProducts.length == 0) {
        this.selectedProducts = [product];
        return;
      }
      if (
        this.selectedProducts.length > 0 &&
        this.selectedProducts[0].serviceData.id == product.serviceData.id
      ) {
        this.selectedProducts = [];
      }
    },
    onContinue() {
      this.setLabToRequest(this.labAccount);
      this.setProductsToRequest(this.selectedProducts);
      this.$router.push({ name: "request-test-checkout" });
    },
    showingStakingDialog() {
      this.showStakingDialog = true
    },
    sendRequestNoLab() {
      this.showStakingDialog = false
    },
    actionAlert() {
      if (this.statusSendReqNoLab) {
        this.showNoLab = false;
        this.showRequestNoLab = false;
        this.isLoadingRequestNoLab = false;
        this.requestNoLabItem = [];
        this.statusSendReqNoLab = false;
        this.regions = [];
        this.region = "region";
        this.city = "city";
        this.country = "country";
        this.cities = [];
      }
      this.dialogAlert = false;
    },
    async onCategoryChange(category) {
      this.category = category
      if (category == "Other") {
        this.showSpecify = true
      }
    },
  },
};
</script>

<style lang="scss">
</style>
