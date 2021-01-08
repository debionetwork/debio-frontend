<template>
  <v-card class="dg-card" elevation="0" outlined>
    <v-card-title class="px-8">
      <div class="text-h6">
        How to send your DNA sample
      </div>
    </v-card-title>
    <v-card-text>
      <v-row v-for="(item, i) in instructions" :key="i" class="mb-2">
        <v-col cols="1" class="pl-6">
          <v-icon>mdi-numeric-{{i + 1}}-circle</v-icon>
        </v-col>
        <v-col class="pl-4">
          <div v-html="item" class=""></div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="1" class="pl-6">
          <v-icon>mdi-numeric-{{instructions.length}}-circle</v-icon>
        </v-col>
        <v-col class="pl-4">
          <div>You can see the status of your order <router-link to="/history-test">here</router-link></div>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="pl-8">
        <b>You do not need to mention your name anywhere, address, or any personal information anywhere</b>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="px-8 pb-5">
      <slot name="button">
      </slot>
    </v-card-actions>
  </v-card>
</template>

<script>
import { fmtSpecimenNumber } from '../lib/string-format'

export default {
  name: 'DNASampleSendingInstructions',
  props: {
    specimenNumber: String,
    lab: Object,
  },
  computed: {
    instructions() {
      return [
        'Follow the instructions attached to your test kit to collect saliva, epithelial, or hair sample.',
        `Write down the specimen number <b>${fmtSpecimenNumber(this.specimenNumber)}</b> on the sample's container.`,
        `Write down the specimen number <b>${fmtSpecimenNumber(this.specimenNumber)}</b> on the sample's envelope.`,
        ` Send the envelope (without return address for maximum privacy), to
          <div><b>${this.lab.name}</b></div>
          <div><b>${this.lab.address ?? ''}</b></div>
          <div><b>${this.lab.city}, ${this.lab.country}</b></div>
        `,
      ]
    }
  },
}
</script>

<style>

</style>
