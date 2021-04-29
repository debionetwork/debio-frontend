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
              <v-select
                dense
                :items="countries"
                item-text="name"
                item-value="alpha-2"
                @change="onCountryChange"
                label="Select Country"
                outlined
              ></v-select>

              <v-select
                dense
                :items="cities"
                item-text="1"
                item-value="0"
                @change="onCityChange"
                label="Select City"
                :disabled="!country"
                outlined
              ></v-select>

              <v-select
                dense
                :items="labs"
                item-value="labData"
                item-text="labName"
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
                Please select a lab that is as close to your location as
                possible.
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
            :key="product.serviceName"
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
                product.serviceData.info.longDescription
                  ? product.serviceData.info.longDescription
                  : product.serviceData.info.description
              "
              :is-selected="isProductSelected(product)"
              :disabled="isProductDisabled(product)"
              @click="selectOneProduct(product)"
            >
              <template v-slot:footer>
                <span class="text-h6">
                  {{ product.price }}
                </span>
                <span class="primary--text text-caption"> DOT </span>
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
  queryLabsByCountryCity,
  queryLabsByIdNew,
} from "@/lib/polkadotProvider/query/labs";
import { queryServicesById } from "@/lib/polkadotProvider/query/services";

export default {
  name: "RequestTest",
  components: {
    SelectableMenuCard,
    DnaCollectionRequirements,
  },
  async mounted() {
    await this.getCountries();
  },
  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
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
  data: () => ({
    country: "",
    city: "",
    labAccount: "",
    selectedProducts: [],
    isLoadingProducts: false,
    countries: [],
    cities: [],
    labs: [],
    products: [],
  }),
  methods: {
    ...mapMutations({
      setLabToRequest: "testRequest/SET_LAB",
      setProductsToRequest: "testRequest/SET_PRODUCTS",
    }),
    async getCountries() {
      this.countries = countryData;
    },
    onCountryChange(selectedCountry) {
      this.country = selectedCountry;
      this.cities = Object.entries(cityData[this.country].divisions);
    },
    onCityChange(selectedCity) {
      this.city = selectedCity;
      this.getLabs();
    },
    async getLabs() {
      if (!this.cities) {
        return;
      }
      //"Indonesia",
      //"Jakarta"
      // this.country,
      //   this.city
      const listLabID = await queryLabsByCountryCity(
        this.api,
        this.country,
        this.city
      );
      if (listLabID != null) {
        for (let i = 0; i < listLabID.length; i++) {
          const detaillab = await queryLabsByIdNew(this.api, listLabID[i]);

          if (detaillab != null) {
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
    },
    async onLabChange(labAccount) {
      this.labAccount = labAccount;
      await this.getLabProducts();
    },
    async getLabProducts() {
      this.isLoadingProducts = true;
      this.products = [];

      try {
        if (this.labAccount != null) {
          for (let i = 0; i < this.labAccount.services.length; i++) {
            const detailService = await queryServicesById(
              this.api,
              this.labAccount.services[i]
            );

            if (detailService != null) {
              const serviceName = detailService.info.name;
              let icon = "mdi-needle";
              if (detailService.info.image != null) {
                icon = detailService.info.image;
              }
              const accountId = this.labAccount.services[i];
              const serviceData = detailService;
              const price = detailService.info.price;

              const product = {
                accountId,
                serviceName,
                icon,
                serviceData,
                price,
              };

              this.products.push(product);
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
        this.selectedProducts.filter((p) => p.code == product.code).length > 0
      );
    },
    isProductDisabled(product) {
      if (this.selectedProducts.length == 0) {
        return false;
      }
      return this.selectedProducts[0].code != product.code;
    },
    selectProduct(product) {
      // deselect
      if (_.includes(this.selectedProducts, product)) {
        this.selectedProducts = this.selectedProducts.filter(
          (p) => p.code != product.code
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
        this.selectedProducts[0].code == product.code
      ) {
        this.selectedProducts = [];
      }
    },
    onContinue() {
      this.setLabToRequest(this.labAccount);
      this.setProductsToRequest(this.selectedProducts);
      this.$router.push({ name: "request-test-checkout" });
    },
  },
};
</script>

<style lang="scss">
</style>
