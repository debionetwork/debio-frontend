<template>
  <v-hover v-slot="{ hover }">
    <v-card
      class="dg-card"
      :elevation="hover ? 2 : 0"
      @click="onClick"
      outlined
      style="border-radius: 10px;"
    >
      <slot></slot>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  name: 'CardButton',
  methods: {
    onClick() {
      this.$emit('click')
    }
  }
}
</script>

<style>

</style>
