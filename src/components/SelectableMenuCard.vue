<template>
  <v-badge
    bordered
    color="primary"
    icon="mdi-checkbox-marked-circle"
    :value="isSelected"
    overlap
    style="width: 100%"
  >
    <MenuCard
      :icon="_icon"
      :title="title"
      :sub-title="subTitle"
      @click="onClick"
    ></MenuCard>
  </v-badge>
</template>

<script>
import MenuCard from './MenuCard'
export default {
  name: 'SelectableMenuCard',
  components: {
    MenuCard
  },
  props: {
    icon: String,
    title: String,
    subTitle: String,
    isSelected: Boolean,
  },
  computed: {
    _icon() {
      return this.icon && (this.icon.startsWith('mdi') || this.icon.startsWith('$'))
        ? this.icon
        : ''
    }
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
