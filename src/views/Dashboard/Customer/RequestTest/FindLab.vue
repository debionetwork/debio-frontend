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
                key="country"
                v-model="country"
                :items="countries"
                item-text="name"
                item-value="iso2"
                @change="onCountryChange"
                label="Select Country"
                autocomplete="disabled"
                :disabled="showRequestNoLab"
                outlined
              ></v-autocomplete>

              <v-autocomplete
                dense
                key="state"
                v-model="state"
                :items="states"
                item-text="name"
                item-value="state_code"
                @change="onStateChange"
                label="Select State"
                :disabled="!country || showRequestNoLab"
                autocomplete="disabled"
                outlined
              ></v-autocomplete>

              <v-autocomplete
                dense
                key="city"
                v-model="city"
                :items="cities"
                item-text="name"
                return-object
                @change="onCityChange"
                label="Select City"
                :disabled="!state || showRequestNoLab"
                autocomplete="disabled"
                outlined
              ></v-autocomplete>

              <v-select
                dense
                :items="labs"
                item-value="labData"
                item-text="labName"
                @change="onLabChange"
                menu-props="auto"
                :label="noLab"
                :disabled="!city || showRequestNoLab"
                autocomplete="disabled"
                outlined
              >
                <template slot='item' slot-scope='{ item }'>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{item.labName}}
                    </v-list-item-title>
                    <v-list-item-subtitle
                      class="d-flex justify-start ms-8 grey--text"
                      flat
                    >
                    {{item.address}}
                    </v-list-item-subtitle>
                  </v-list-item-content>
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

      <div class="mt-5">
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
              :disabled="disableSubmitButton"
              width="100%"
              @click="showingStakingDialog"
            >
              Submit
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
              @click="actionAlert()"
            >
              Cancel
            </v-btn>
          </v-col>

            <StakingDialog 
              :show="showStakingDialog"
              @toggle="showStakingDialog = $event"
              @close="actionAlert()"           
              />

            <DialogAlert
              :show="dialogAlert"
              btn-text="Continue"
              text-alert="Your request has been submitted! We have sent details about your request."
              img-path="success.png"
              img-width="50"
              @toggle="dialogAlert = $event"
              @close="actionAlert()"
            ></DialogAlert>
        </v-row>
      </div>
      
      <div v-if="isLoadingProducts" class="d-flex justify-center mt-10">
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </div>

      <template v-if="labAccount && !isLoadingProducts && !showRequestNoLab">
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
            <v-col
              cols="12"
              xl="4"
              lg="4"
              md="6"
              :class="$vuetify.breakpoint.smAndDown ? 'py-0' : 'py-1'"
            >
              <SelectableMenuCard
                icon="mdi-file-find"
                title="Request a service"
                sub-title="Could not find a service? Click here to request."
                @click="showRequestNoLab = true"
              >
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


      <ServiceDialog
        :show="dialogAlert"
        :icon="icon"
        :serviceName="serviceName"
        :description="description"
        :duration="duration"
        :downloadPath="downloadPath"
        :serviceId="serviceId"
        @toggle="dialogAlert = $event"
        @close="actionAlert()"
      ></ServiceDialog>
    </v-container>
  </div>
</template>

<script>
import _ from "lodash";
import { mapState, mapMutations } from "vuex";
import SelectableMenuCard from "@/components/SelectableMenuCard";
import DnaCollectionRequirements from "./DnaCollectionRequirements";
import { getLocations, getStates, getCities } from "@/lib/location"
import DialogAlert from '@/components/Dialog/DialogAlert'
import {
  queryLabsByCountryRegionCity,
  queryLabsById,
} from "@/lib/polkadotProvider/query/labs";
import { queryServicesById } from "@/lib/polkadotProvider/query/services";
import StakingDialog from "./StakingDialog.vue"
import ServiceDialog from '@/components/Dialog/ServiceDialog'
import categories from '@/constants/categories'
import serviceHandler from "@/lib/metamask/mixins/serviceHandler"

export default {
  name: "FindLab",
  mixins: [serviceHandler],

  components: {
    SelectableMenuCard,
    DnaCollectionRequirements,
    DialogAlert,
    StakingDialog,
    ServiceDialog
  },

  data: () => ({
    country: "",
    state: "",
    city: "",
    labAccount: "",
    selectedProducts: [],
    isLoadingProducts: false,
    countries: [],
    category: "",
    states: [],
    cities: [],
    labs: [],
    products: [],
    coinName: "",
    listCategories: [],
    showRequestNoLab: false,
    showNoLab: false,
    showSpecify: false,
    isLoadingRequestNoLab: false,
    dialogAlert: false,
    statusSendReqNoLab: false,
    showStakingDialog: false,
    icon: "",
    serviceName: "",
    description: "",
    duration: "",
    durationType: "",
    downloadPath: "",
    serviceId: ""
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      configApp: (state) => state.auth.configApp,
    }),

    noLab() {
      if (this.showNoLab) return 'There are no available lab'

      return 'Select Test Lab'
    },

    disableSubmitButton() {
      return this.isLoadingRequestNoLab || this.category.length == 0
    }
  },

  async mounted() {
    this.coinName = this.configApp.tokenName;
    await this.getCountries();
    this.listCategories = categories
  },

  methods: {
    ...mapMutations({
      setLabToRequest: "testRequest/SET_LAB",
      setProductsToRequest: "testRequest/SET_PRODUCTS",
      setCategory: "lab/SET_CATEGORY"
    }),

    async getCountries() {
      const { data:
        { data }
      } = await this.dispatch(getLocations)
      this.showNoLab = false;
      this.countries = data;
    },

    async onCountryChange(selectedCountry) {
      const { data:
        { data }
      } = await this.dispatch(getStates, selectedCountry)
      this.showNoLab = false;
      this.states = data;
      this.country = selectedCountry;
    },

    async onStateChange(selectedState) {
      const { data:
        { data }
      } = await this.dispatch(getCities, this.country, selectedState)
      this.cities = data;
      this.state = selectedState;
      this.showNoLab = false;
    },

    async onCityChange({ name }) {
      this.showNoLab = false;
      this.city = name;
      await this.getLabs();
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
        this.country + "-" + this.country + "-" + this.state,
        this.country + "-" + this.state,
      );

      if (listLabID) {
        for (let i = 0; i < listLabID.length; i++) {
          const detailLab = await queryLabsById(this.api, listLabID[i]);
          let labId = listLabID[i-1]
          if (detailLab && detailLab.account_id != labId ) {
            const labName = detailLab.info.name;
            const accountId = detailLab.account_id;
            const address = detailLab.info.address;
            const labData = detailLab;

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
      if (this.selectedProducts[0].serviceData.info.expected_duration.duration_type == "WorkingDays") {
        this.durationType = "working days"
      } else {
        this.durationType = this.selectedProducts[0].serviceData.info.expected_duration.duration_type
      }
      this.icon = this.selectedProducts[0].icon
      this.serviceName = this.selectedProducts[0].serviceName
      this.description = this.selectedProducts[0].serviceData.info.description
      this.duration = `${this.selectedProducts[0].serviceData.info.expected_duration.duration} ${this.durationType}`
      this.downloadPath = this.selectedProducts[0].serviceData.info.test_result_sample
      this.serviceId = this.selectedProducts[0].serviceData.id
      
      this.dialogAlert = true

      this.setLabToRequest(this.labAccount);
      this.setProductsToRequest(this.selectedProducts);
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
        this.statusSendReqNoLab = false;
        this.city = "city";
        this.country = "country";
        this.cities = [];
      }
      this.dialogAlert = false;
    },
    onCategoryChange(category) {
      this.category = category
      if (category == "Other") {
        this.showSpecify = true
      }
      this.setCategory(category)
    },
  },
};
</script>

<style lang="scss">
</style>
