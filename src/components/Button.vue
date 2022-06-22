<template>
  <v-btn
    :outlined="outlined"
    :dark="dark"
    :color="color"
    depressed
    large
    width="100%"
    :elevation="elevation"
    :loading="loading"
    :to="to"
    @click="onClick"
  >
    <slot></slot>
  </v-btn>
</template>

<script>
export default {
  name: "Button",
  props: {
    outlined: Boolean,
    color: {
      type: String,
      default: "primary"
    },
    to: {
      type: [String, Object],
      default: null
    },
    elevation: String,
    dark: {
      type: Boolean,
      default: true
    },
    loading: Boolean
  },
  methods: {
    onClick() {
      this.$emit("click")
    }
  }
}
</script>

<style>

</style>
