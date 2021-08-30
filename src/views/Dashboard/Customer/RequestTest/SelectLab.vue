<template>
  <v-container>
    <v-row>
      <v-col v-if="showNoLab" cols="12" xl="8" lg="8" md="8" order-md="1" order="2">
        <v-card class="dg-card" elevation="0" outlined>
          <v-card-title class="px-8" color="white">
            <div class="text-h6">Oops! this service is not available </div>
          </v-card-title>
          <div class="ml-8 mr-8 mb-8 grey--text text--darken-1">
            <div>
              <b :style="{'color': 'red' }"> There are no lab available in your city. </b> <br><br>

                1. You can request a lab to register to DeBio by clicking the "Request a service" button. <br><br>
                2. Additionally, you can stake an amount of tokens or regular cirrency(USD), which will be given as an incentive to labs registering in your location. <br><br>
                3. Labs will use the result of this form, filled-in by you and other DeBio users, to evaluate the demand in the area you designated.
            </div>
            <v-btn
              class="mt-5"
              depressed
              color="primary"
              large
              width="100%"
              @click="showStakingDialog = true"
            >
              Request a service
            </v-btn>
          </div>
        </v-card>

        <StakingDialog 
          :show="showStakingDialog"
          @toggle="showStakingDialog = $event"
        />
      </v-col>

      <v-col v-else cols="12" xl="12" lg="12" md="8">
        <v-card class="dg-card" elevation="0" outlined>
          <v-row class="mt-2">
            <v-col cols="12" class="ml-5">
              <div class="px-2">
                <div class="text-h6">
                  <b>Select your prefered lab location</b>
                </div>
              </div>
            </v-col>
          </v-row>

          <v-row class="px-10 mb-9">
            <v-col
              v-for="(lab, i) in labs"
              :key="i"
              cols="12"
              xl="4"
              lg="4"
              md="6"
              >
              <SelectableMenuCard
                  :icon="lab._source.info.profile_image"
                  :title="lab._source.info.name"
                  :sub-title="lab._source.info.address"
                  @click="selectLab(lab)"
                >
                  <template v-slot:footer>
                    <span class="text-h6">
                    </span>
                    <span class="primary--text text-caption">
                    </span>
                  </template>
              </SelectableMenuCard>

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
            </v-col>
          </v-row>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>

import StakingDialog from "./StakingDialog.vue"
import SelectableMenuCard from "@/components/SelectableMenuCard";
import { mapState } from "vuex";
import ServiceDialog from '@/components/Dialog/ServiceDialog'


export default {
  name: "SelectLab",
  data: () => ({
    showStakingDialog: false,
    service: "",
    dialogAlert: false,
    icon: "",
    accountId: "",
    serviceName: "",
    description: "",
    duration: "",
    durationType: "",
    downloadPath: "",
    serviceId: "",
    additionalPrices: "",
    currency: "",
    price: 0,
    totalPrice: "",
    labAccount:""
  }),
  components: {
    StakingDialog,
    SelectableMenuCard,
    ServiceDialog
  },
  computed: {
    ...mapState({
      category: (state) => state.lab.category,
      labs: (state) => state.lab.labs,
    }),
    showNoLab() {
      if (this.labs.length < 1 ) {
        return true
      }
      return false
    },
  },
  methods: {
    async selectLab(lab) {
      const services = lab._source.services
      this.service = services.filter((s) => s.info.category == this.category)
      if (this.service[0].info.expected_duration.duration_type == "WorkingDays") {
        this.durationType = "working days"
      } else {
        this.durationType = this.service[0].info.expected_duration.duration_type
      }
      this.accountId = this.service[0].id

      console.log('accountId', this.accountId)

      this.labAccount = lab._source

      this.icon = this.service[0].info.image
      this.serviceName = this.service[0].info.name
      this.description = this.service[0].info.description
      this.duration = `${this.service[0].info.expected_duration.duration} ${this.durationType} `
      this.downloadPath = this.service[0].info.test_result_sample
      this.additionalPrices = this.service[0].info.prices_by_currency[0].additional_prices[0].value
      this.currency = this.service[0].info.prices_by_currency[0].currency
      this.price = this.service[0].info.prices_by_currency[0].price_components[0].value
      this.totalPrice = this.service[0].info.prices_by_currency[0].total_price
      this.serviceId = lab._id
      this.dialogAlert = true

      let selectedService = [
        {
          accountId: this.accountId,
          additionalPrices: this.additionalPrices.toString(),
          currency: this.currency,
          icon: this.icon,
          indexPrice: 0,
          price: this.price.toString(),
          serviceData: this.service[0],
          serviceName: this.serviceName,
          totalPrice: this.totalPrice.toString()
        }
      ]
      await this.$store.dispatch("testRequest/getLab", this.labAccount);
      await this.$store.dispatch("testRequest/getProduct", selectedService);
    }
  }
}
</script>

<style lang="scss">
</style>
