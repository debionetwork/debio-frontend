<template>
  <v-card class="dg-card" elevation="0" outlined>
    <v-card-title class="px-8">
      <div class="text-h6">
        Failed Test
      </div>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col class="pl-8">
        <b>Realy Sory the test is Failed.</b>
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

export default {
  name: 'RejectedReasonDialog',
  props: {
    specimen: String,
  },
}
</script>

<style>

</style>
