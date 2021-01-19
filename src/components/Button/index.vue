<template>
  <v-btn
    depressed
    :color="color"
    large
    width="100%"
    @click="onClick"
    :style="dark ? 'color:white' : ''"
  >
    <slot></slot>
  </v-btn>
</template>

<script>
export default {
  name: 'Button',
  props: {
    color: String,
    dark: Boolean,
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