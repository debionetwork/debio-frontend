<template>
  <component v-bind:is="cardComponent" @click="onClick">
      <div class="d-flex align-center fill-height pr-2">
        <div class="my-3 ml-5">
          <v-icon
            v-if="icon"
            color="#BA8DBB"
            :size="48"
          >
            {{ icon }}
          </v-icon>
          <v-avatar v-else>
            <img src="../../assets/degenics-logo.webp" />
          </v-avatar>
        </div>
        <div class="ml-5">
          <div class="text-h6">
            <b>{{ title }}</b>
          </div>
          <div class="text-caption grey--text text--darken-1">
            {{ subTitle }}
          </div>
        </div>
      </div>
  </component>
</template>

<script>
import EnabledMenuCard from './EnabledMenuCard'
import DisabledMenuCard from './DisabledMenuCard'

export default {
  name: 'MenuCard',
  props: {
    icon: String,
    title: String,
    subTitle: String,
    disabled: Boolean,
  },
  components: {
    EnabledMenuCard,
    DisabledMenuCard,
  },
  computed: {
    cardComponent() {
      return this.disabled ? 'DisabledMenuCard' : 'EnabledMenuCard'
    },
  },
  methods: {
    onClick() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
.dg-menu-card {
  height: 90px;
  width: 100%;
}
</style>

