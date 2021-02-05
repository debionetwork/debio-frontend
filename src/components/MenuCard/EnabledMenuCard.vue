<template>
  <v-hover v-slot="{ hover }">
    <v-card
      class="dg-card dg-menu-card"
      :class="{ 'card-hover': hover }"
      :elevation="hover ? 2 : 0"
      @click="onClick"
      outlined
      :style="`border-radius: 10px; ${height ? 'height:' + height + 'px' : ''}`"
      :ripple="false"
    >
      <slot></slot>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  name: 'EnabledMenuCard',
  props: {
    height: Number,
  },
  methods: {
    onClick() {
      this.$emit('click')
    }
  }
}
</script>

<style>

</style>
