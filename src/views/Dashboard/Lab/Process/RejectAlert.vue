<template>
  <div>
    <v-alert
      type="success"
      rounded="true"
      class="rounded-lg"
      color="yellow"
      icon="mdi-cancel"
    >
      <b>Specimen Rejected</b>
    </v-alert>
    <v-card class="dg-card">
      <v-card-title class="px-8">
        <div class="text-h6">
          Rejection Reason
        </div>
      </v-card-title>
      <v-card-text class="px-8">
        TODO: Rejection Reason
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'RejectAlert'
}
</script>

<style>

</style>