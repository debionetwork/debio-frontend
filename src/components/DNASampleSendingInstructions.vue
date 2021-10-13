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
import cityData from "@/assets/json/city.json";

export default {
  name: "DNASampleSendingInstructions",
  components: {
    BulletPoint,
  },
  props: {
    specimenNumber: String,
    lab: Object,
    orderId: String,
    sourcePage: String,
    hideOrderHistoryLink: Boolean,
  },
  data: () => ({
    country: "",
    city: "",
  }),
  computed: {
    instructions() {
      return [
        `Write down the specimen number <b>${fmtSpecimenNumber(
          this.specimenNumber
        )}</b> on the sample's tube.`,
        `Write down the specimen number <b>${fmtSpecimenNumber(
          this.specimenNumber
        )}</b> on the sample's envelope.`,
        ` Send the envelope (without return address for maximum privacy), to
          <div><b>${this.lab.name}</b></div>
          <div><b>${this.lab.address ?? ""}</b></div>
          <div><b>${this.city}, ${this.country}</b></div>
          <div style="margin-top: 12px; text-decoration: underline;"><b>You do not need to mention your name, address, or any personal information</b></div>
        `,
      ];
    },
  },
  mounted() {
    if (this.lab != null) {
      this.country = cityData[this.lab.country].name;
      this.city = cityData[this.lab.country].divisions[this.lab.city];
    }
  },
};
</script>

<style>
</style>
