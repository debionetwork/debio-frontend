<template>
  <v-card class="dg-card pb-4">
    <v-card-title class="px-8">
      <div class="text-h6">
        Checklist
      </div>
    </v-card-title>
    <v-card-text class="px-8">
      <v-checkbox
        v-for="action in actions"
        :key="action"
        :input-value="doneActions"
        :label="action"
        :value="action"
        readonly
        color="success"
        hide-details="true"
      ></v-checkbox>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'Checklist',
  props: {
    specimen: Object,
    actions: Array,
    doneActions: Array
  },
}
</script>

<style>

</style>