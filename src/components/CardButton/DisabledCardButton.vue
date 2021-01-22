<template>
  <v-card
    class="dg-card card-button disabled"
    outlined
    style="border-radius: 10px;"
    :ripple="false"
  >
    <slot></slot>
  </v-card>
</template>

<script>
export default {
  name: 'DisabledCardButton',
  methods: {
  }
}
</script>

<style lang="scss">
.card-button.disabled {
  background: #0000001f !important;
}
</style>
