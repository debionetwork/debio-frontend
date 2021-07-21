<template>
  <v-card class="dg-card" elevation="0" outlined>
    <v-card-title class="px-8">
      <div class="text-h6">How to send your DNA sample</div>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="1" class="pl-6">
          <BulletPoint>1</BulletPoint>
        </v-col>
        <v-col class="pl-4">
          <div>
            Follow the instructions to collect your DNA sample
            <a
              :href="
                $router.resolve({
                  name: 'dna-collection-instructions',
                  params: { number: orderId },
                }).href
              "
              :target="
                sourcePage == 'order-history-detail' ? '_self' : '_blank'
              "
            >
              here
            </a>
            .
          </div>
        </v-col>
      </v-row>
      <v-row v-for="(item, i) in instructions" :key="i" class="mb-2">
        <v-col cols="1" class="pl-6">
          <BulletPoint>{{ i + 2 }}</BulletPoint>
        </v-col>
        <v-col class="pl-4">
          <div v-html="item" class=""></div>
        </v-col>
      </v-row>
      <v-row v-if="!hideOrderHistoryLink">
        <v-col cols="1" class="pl-6">
          <BulletPoint>{{ instructions.length + 2 }}</BulletPoint>
        </v-col>
        <v-col class="pl-4">
          <div>
            You can see the status of your orders
            <router-link to="/customer/order-history">here</router-link>.
          </div>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="px-8 pb-5">
      <slot name="button"> </slot>
    </v-card-actions>
  </v-card>
</template>

<script>
import BulletPoint from "@/components/BulletPoint";
import { fmtSpecimenNumber } from "../lib/string-format";
import { getLocation } from "@/lib/api";
import { mapState } from "vuex";

export default {
  name: "DNASampleSendingInstructions",
  components: {
    BulletPoint,
  },
  data: () => ({
    country: "",
    city: "",
    region: "",
  }),
  props: {
    specimenNumber: String,
    lab: Object,
    orderId: String,
    sourcePage: String,
    hideOrderHistoryLink: Boolean,
  },
  computed: {
    ...mapState({
      countryData: (state) => state.auth.countryData,
    }),
    instructions() {
      return [
        `Write down the specimen number <b>${fmtSpecimenNumber(
          this.specimenNumber
        )}</b> on the sample's tube.`,
        `Write down the specimen number <b>${fmtSpecimenNumber(
          this.specimenNumber
        )}</b> on the sample's envelope.`,
        ` Send the envelope (without return address for maximum privacy), to
          <div><b>${this.lab.info.name}</b></div>
          <div><b>${this.lab.info.address ?? ""}</b></div>
          <div><b>${this.city}, ${this.region}, ${this.country}</b></div>
          <div style="margin-top: 12px; text-decoration: underline;"><b>You do not need to mention your name, address, or any personal information</b></div>
        `,
      ];
    },
  },
  async mounted() {
    if (this.lab != null) {
      const countries = this.countryData;
      let result = countries.find(function (data) {
        return data.code == this.lab.info.country;
      });
      if (result != undefined) {
        this.country = result.name;
      }

      const regions = await getLocation(this.country, null);
      result = regions.find(function (data) {
        return data.code == this.lab.info.region;
      });
      if (result != undefined) {
        this.region = result.name;
      }

      const cities = await getLocation(this.country, this.region);
      result = cities.find(function (data) {
        return data.code == this.lab.info.city;
      });

      if (result != undefined) {
        this.city = result.name;
      }
    }
  },
};
</script>

<style>
</style>
