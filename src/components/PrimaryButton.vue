<template>
  <v-btn
    depressed
    color="primary"
    large
    width="100%"
    @click="onClick"
  >
    <slot></slot>
  </v-btn>
</template>

<script>
export default {
  name: 'PrimaryButton',
  methods: {
    onClick() {
      this.$emit('click')
    }
  }
}
</script>

<style>

</style>
