<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" xl="8" lg="8" md="8" order-md="1" order="2">
          <v-card class="dg-card" elevation="0" outlined>
            <v-card-title class="px-8">
              <div class="text-h6">Select a Test</div>
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
                :disabled="showRequestNoCategory"
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
                :disabled="country == 'country' || showRequestNoCategory"
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
                :disabled="region == 'region' || showRequestNoCategory"
                autocomplete="disabled"
                outlined
              ></v-autocomplete>

              <v-select
                dense
                :items="services"
                item-value="serviceName"
                item-text="serviceName"
                @change="onCategoryChange"
                menu-props="auto"
                :label="noCategory"
                :disabled="city == 'city' || showRequestNoCategory"
                autocomplete="disabled"
                outlined
              >
              </v-select>
            </v-card-text>
            <div
              class="ml-8 mr-8 mb-8 grey--text text--darken-1"
              v-if="showNoCategory"
            >
              <div v-if="showRequestNoCategory">
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
                      :disabled="isLoadingRequestNoService"
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
        </v-col>
      </v-row>

      <div class="mt-5" v-if="showNoCategory">
        <v-row>
          <v-col v-if="isLoadingRequestNoService" cols="12" lg="12" md="12" sm="12">
            <v-progress-linear
              indeterminate
              color="primary"
            ></v-progress-linear>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="8" md="8" sm="8">
            <v-btn
              v-if="showRequestNoCategory"
              depressed
              color="primary"
              large
              :disabled="isLoadingRequestNoService || requestNoLabItem.length == 0"
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
              @click="showRequestNoCategory = true"
            >
              Request a Lab
            </v-btn>
          </v-col>
          <v-col cols="12" lg="4" md="4" sm="4">
            <v-btn
              v-if="showRequestNoCategory"
              depressed
              color="orange"
              large
              width="100%"
              :disabled="isLoadingRequestNoService"
              @click="showRequestNoCategory = false"
            >
              Cancel
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <div v-if="isLoadingCategory" class="d-flex justify-center mt-10">
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </div>

      <template v-if="serviceAccount && !isLoadingCategory">
        <v-row class="mt-4">
          <v-col cols="12">
            <div class="px-2">
              <div class="text-h5 secondary--text text--lighten-2">
                <b>{{ serviceName }}</b>
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
                <b>Select Lab</b>
              </div>
            </div>
          </v-col>
        </v-row>

        <v-row class="pt-1">
          <v-col
            v-for="lab in labs"
            :key="lab.accountId"
            cols="12"
            xl="4"
            lg="4"
            md="6"
            :class="$vuetify.breakpoint.smAndDown ? 'py-0' : 'py-1'"
          >
            <SelectableMenuCard
              :icon="labIcon"
              :title="lab.labName"
              :sub-title="lab.labData.info.address"
              :is-selected="isLabSelected(lab)"
              :disabled="isLabDisabled(lab)"
              @click="selectOneLab(lab)"
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
              :disabled="selectedLab.length == 0"
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
import DialogAlert from "@/components/Dialog/DialogAlert";

export default {
  name: "FindLab",
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
    selectedLab: [],
    isLoadingCategory: false,
    countries: [],
    cities: [],
    regions: [],
    services: [],
    labs: [],
    lab: {},
    coinName: "",
    listProducsNoLab: [],
    showRequestNoCategory: false,
    showNoCategory: false,
    requestNoLabItem: [],
    isLoadingRequestNoService: false,
    dialogAlert: false,
    alertTextBtn: "",
    alertImgPath: "warning.png",
    alertTextAlert: "",
    imgWidth: "50",
    statusSendReqNoLab: false,
    labIcon: 'mdi-test-tube',
    dummyProduct: [{
      accountId: "0xe88f0531fea1654b6a24197ec1025fd7217bb8b19d619bd488105504ec244df8",
      additionalPrices: "5",
      currency: "Dai",
      icon: "mdi-dna",
      indexPrice: 0,
      price: "15",
      serviceData: {
        id: "0xe88f0531fea1654b6a24197ec1025fd7217bb8b19d619bd488105504ec244df8",
        info: {
          category: "Whole-Genome Sequencing",
          description: "Analyze your entire genomic DNA sequence. Genomic information 			has been instrumental in identifying inherited disorders, characterizing the 		mutations that drive cancer progression, and tracking disease outbreaks.",
          dna_collection_process: null,
          expected_duration: {
            duration: "7",
            duration_type: "WorkingDays",
          },
        image: "mdi-dna",
        long_description: null,
        name: "Whole Genome Sequencing",
        price: "20 Dai",
        prices_by_currency: [{
          additional_prices: [{
            component: "qc_price",
            value: "5",
          }],
          currency: "Dai",
          price_components: [{
            component: "testing_price",
            value: "15"
          }],
          total_price: "20"
        }],
        test_result_sample: ""
      },	
      owner_id: "5ESGhRuAhECXu96Pz9L8pwEEd1AeVhStXX67TWE1zHRuvJNU"	
      },
      serviceName: "Whole Genome Sequencing"
    }]
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
      return this.cities.reduce((filtered, c) => {
        if (c.country == this.country) filtered.push({ value: c.city, text: c.city, country: c.country })
        return filtered
      }, [])
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
    noCategory() {
      if (this.showNoCategory) {
        return 'There are no available category'
      } else {
        return 'Select Test Category'
      }
    }
  },
  methods: {
    ...mapMutations({
      setLabToRequest: "testRequest/SET_LAB",
      setProductsToRequest: "testRequest/SET_PRODUCTS",
    }),
    async getCountries() {
      this.showNoCategory = false;
      this.countries = countryData;
    },
    onCountryChange(selectedCountry) {
      this.showNoCategory = false;
      this.regions = [];
      this.region = "region";
      this.city = "city";
      this.cities = [];
      this.country = selectedCountry;
      this.regions = Object.entries(cityData[this.country].divisions);
    },
    onRegionChange(selectedRegion) {
      this.showNoCategory = false;
      this.city = "city";
      this.cities = [];
      this.region = selectedRegion;
      this.cities = Object.entries(cityData[this.country].divisions);
    },
    onCityChange(selectedCity) {
      this.showNoCategory = false;
      this.city = selectedCity;
      this.getServices();
    },
    async getServices() {
      if (!this.cities) {
        return;
      } 
      this.serviceAccount = "";
      this.services = [];
      this.products = [];
      if (this.city == "ID-JK") {
        const serviceList = ['Whole-Genome Sequencing']
        for (let i = 0; i < serviceList.length; i++) {
          if (serviceList) {          
            this.services.push(serviceList[i]);
          }
        }
      } else {
        this.showNoCategory = true
      } 
    },
    async onCategoryChange(serviceAccount) {
      this.serviceAccount = serviceAccount
      this.getLabs()
    },
    async getLabs() {
      this.isLoadingCategory = true;
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
            this.labs.push(lab)
          }
          this.labAccount = detaillab
        }
      }
      this.isLoadingCategory = false;
    },
    isLabSelected(lab) {
      return (
        this.selectedLab.filter(
          (l) => l.accountId == lab.accountId
        ).length > 0
      );
    },
    isLabDisabled(lab) {
      if (this.selectedLab.length == 0) {
        return false;
      }
      return this.selectedLab[0].accountId != lab.accountId;
    },
    selectProduct(lab) {
      // deselect
      if (_.includes(this.selectedLab, lab)) {
        this.selectedLab = this.selectedLab.filter(
          (l) => l.accountId != lab.accountId
        );
      }
      // select
      this.selectedLab = [...this.selectedLab, lab];
    },
    selectOneLab(lab) {
      if (this.selectedLab.length == 0) {
        this.selectedLab = [lab];
        return;
      }
      if (
        this.selectedLab.length > 0 &&
        this.selectedLab[0].accountId == lab.accountId
      ) {
        this.selectedLab = [];
      }
    },
    onContinue() {
      this.setLabToRequest(this.labAccount);
      this.setProductsToRequest(this.dummyProduct);
      this.$router.push({ name: "request-test-checkout" });
    },
    sendRequestNoLab() {
      this.isLoadingRequestNoService = true;

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

      this.isLoadingRequestNoService = false;
    },
    actionAlert() {
      if (this.statusSendReqNoLab) {
        this.showNoCategory = false;
        this.showRequestNoCategory = false;
        this.isLoadingRequestNoService = false;
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
