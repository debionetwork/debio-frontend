<template>
  <v-card
    class="dg-card dg-menu-card disabled"
    outlined
    style="border-radius: 10px;"
    :ripple="false"
  >
    <slot></slot>
  </v-card>
</template>

<script>
export default {
  name: 'DisabledMenuCard'
}
</script>

<style lang="scss">
.dg-menu-card.disabled {
  background: #0000001f !important;
}

</style>
