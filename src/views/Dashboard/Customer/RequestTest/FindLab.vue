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

              <v-select
                dense
                :items="labs"
                item-value="labData"
                item-text="labName"
                @change="onLabChange"
                menu-props="auto"
                :label="
                  showNoLab ? 'There are no available labs' : 'Select Lab'
                "
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
            </v-card-text>
            <div
              class="ml-8 mr-8 mb-8 grey--text text--darken-1"
              v-if="showNoLab"
            >
              <div v-if="showRequestNoLab">
                <v-row>
                  <v-col
                    cols="12"
                    lg="12"
                    md="12"
                    sm="12"
                    class="font-weight-bold"
                  >
                    Select Product
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    v-for="item in listProducsNoLab"
                    :key="item.alias"
                    cols="12"
                    lg="4"
                    md="4"
                    sm="4"
                  >
                    <input
                      type="checkbox"
                      :id="item.alias"
                      :value="item.value"
                      v-model="requestNoLabItem"
                      :disabled="isLoadingRequestNoLab"
                    />
                    <label class="ml-2" :for="item.alias">{{
                      item.text
                    }}</label>
                  </v-col>
                </v-row>
              </div>
              <div v-else>
                If there are no labs in your area, you can express your interest
                for lab services by making a request using this form. Labs can
                use the requests to gauge the demand for services in the area.
              </div>
              <DialogAlert
                :show="dialogAlert"
                :btnText="alertTextBtn"
                :textAlert="alertTextAlert"
                :imgPath="alertImgPath"
                :imgWidth="imgWidth"
                @toggle="dialogAlert = $event"
                @close="actionAlert()"
              ></DialogAlert>
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
              :disabled="isLoadingRequestNoLab || requestNoLabItem.length == 0"
              width="100%"
              @click="sendRequestNoLab"
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
              Continue
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
import DialogAlert from "@/components/Dialog/DialogAlert";

export default {
  name: "RequestTest",
  components: {
    SelectableMenuCard,
    DnaCollectionRequirements,
    DialogAlert,
  },
  data: () => ({
    country: "country",
    city: "city",
    region: "region",
    labAccount: "",
    selectedProducts: [],
    isLoadingProducts: false,
    countries: [],
    cities: [],
    regions: [],
    labs: [],
    products: [],
    coinName: "",
    listProducsNoLab: [],
    showRequestNoLab: false,
    showNoLab: false,
    requestNoLabItem: [],
    isLoadingRequestNoLab: false,
    dialogAlert: false,
    alertTextBtn: "",
    alertImgPath: "warning.png",
    alertTextAlert: "",
    imgWidth: "50",
    statusSendReqNoLab: false,
  }),
  async mounted() {
    this.coinName = this.configApp.tokenName;
    this.listProducsNoLab = [
      {
        text: "Genetic Traits",
        value: "Genetic Traits",
        alias: "gts",
      },
      {
        text: "Skincare",
        value: "Skincare",
        alias: "skin",
      },
      {
        text: "Cancer Diagnosis",
        value: "Cancer Diagnosis",
        alias: "cds",
      },
      {
        text: "Suplement",
        value: "Suplement",
        alias: "spt",
      },
      {
        text: "Thalasemia Test",
        value: "Thalasemia Test",
        alias: "ttt",
      },
      {
        text: "Klinefelter syndrome",
        value: "Klinefelter syndrome",
        alias: "ksd",
      },
      {
        text: "Ancestry",
        value: "Ancestry",
        alias: "anc",
      },
      {
        text: "Crohn's disease",
        value: "Crohn's disease",
        alias: "cde",
      },
      {
        text: "Anemia",
        value: "Anemia",
        alias: "ane",
      },
    ];
    await this.getCountries();
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

      // this.country = "WL";
      // this.city = "WL";
      // this.region = "WL";
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
        return;
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
    sendRequestNoLab() {
      this.isLoadingRequestNoLab = true;

      this.alertTextBtn = "Continue";
      this.alertImgPath = "success.png";
      this.statusSendReqNoLab = true;
      this.alertTextAlert =
        "Your request has been submitted! We have sent details about your request.";
      this.dialogAlert = true;

      this.$store.dispatch("substrate/addAnyNotification", {
        address: this.wallet.address,
        dataAdd: {
          message: "Your request has been submitted!",
          data: null,
          route: "",
          params: "",
        },
        role: "customer",
      });

      this.isLoadingRequestNoLab = false;
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
  },
};
</script>

<style lang="scss">
</style>
