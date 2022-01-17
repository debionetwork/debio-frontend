<template>
  <v-hover v-slot="{ hover }">
    <router-link class="link-card" :to="to">
      <v-card
        class="dg-card dg-menu-card"
        :class="{ 'card-hover': hover }"
        :elevation="hover ? 2 : 0"
        @click="onClick"
        outlined
        :style="`border-radius: 10px; ${height ? 'height:' + height + 'px' : ''}`"
        :ripple="false"
      >
        <slot></slot>
      </v-card>
    </router-link>
  </v-hover>
</template>

<script>
export default {
  name: 'EnabledMenuCard',
  props: {
    height: Number,
    to: { type: [String, Object], default: "" },
  },
  methods: {
    onClick() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss">
.link-card {
  display: block;
  text-decoration: none !important;
}
</style>
