<template>
  <v-card
    class="dg-card dg-menu-card disabled"
    outlined
    :style="`border-radius: 10px; ${height ? 'height:' + height + 'px' : ''}`"
    :ripple="false"
  >
    <slot></slot>
  </v-card>
</template>

<script>
export default {
  name: 'DisabledMenuCard',
  props: {
    height: Number,
  }
}
</script>

<style lang="scss">
.dg-menu-card.disabled {
  background: #0000001f !important;
}

</style>
