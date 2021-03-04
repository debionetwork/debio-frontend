<template>
  <v-btn
    :outlined="outlined"
    :dark="dark"
    :color="color"
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
  name: 'Button',
  props: {
    outlined: Boolean,
    color: {
      type: String,
      default: 'primary'
    },
    dark: {
      type: Boolean,
      default: true,
    },
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
