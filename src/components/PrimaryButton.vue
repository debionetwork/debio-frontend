<template>
  <v-btn
    :outlined="outlined"
    color="primary"
    depressed
    large
    width="100%"
    @click="onClick"
  >
    <slot></slot>
  </v-btn>
</template>

<script>
export default {
  name: "PrimaryButton",
  props: {
    outlined: Boolean
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
