<template>
  <v-card class="dg-card pb-5 pt-2 mt-5" elevation="0" outlined>
    <v-card-title v-if="$slots.title" class="px-8">
      <div class="d-flex">
        <slot name="title_icon"></slot>
        <div class="text-h6" :class="{ 'ml-2': $slots.title_icon }" style="color: #373737;">
          <slot name="title"></slot>
        </div>
      </div>
    </v-card-title>
    <v-card-text class="px-8 pb-2">
      <slot name="text"></slot>
    </v-card-text>
    <v-card-actions v-if="$slots.actions" class="px-8 pb-5">
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
