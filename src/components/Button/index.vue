<template>
  <v-btn
    depressed
    :color="color"
    large
    width="100%"
    @click="onClick"
    :style="dark ? 'color:white' : ''"
    :disabled="disabled"
    :loading="loading"
    v-on="on"
    v-bind="bind"

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
    disabled: Boolean,
    loading: Boolean,
    on: [Boolean, String, Function, Object],
    bind: [Boolean, String, Function, Object]
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