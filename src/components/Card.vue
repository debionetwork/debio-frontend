<template>
  <v-card class="dg-card" elevation="0" outlined>
    <v-card-title class="px-8">
      <div class="text-h6">
        <slot name="title"></slot>
      </div>
    </v-card-title>
    <v-card-text class="px-8">
      <slot name="text"></slot>
    </v-card-text>
    <v-card-actions class="px-8 pb-5">
      <slot name="actions">
      </slot>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'Card'
}
</script>

<style>

</style>