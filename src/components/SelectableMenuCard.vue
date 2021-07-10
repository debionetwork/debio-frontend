<template>
  <v-badge
    color="success"
    icon="mdi-checkbox-marked-circle"
    :value="isSelected"
    overlap
    style="width: 100%"
    class="dg-selectable-card-badge"
  >
    <MenuCard
      :icon="icon"
      :title="title"
      :sub-title="subTitle"
      @click="onClick"
      :disabled="disabled"
      :hover-text="hoverText"
    >
      <template v-slot:footer>
        <slot name="footer"></slot>
      </template>
    </MenuCard>
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
    hoverText: String,
    isSelected: Boolean,
    disabled: Boolean,
  },
  methods: {
    onClick() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss">
.dg-selectable-card-badge {
  span.v-badge__badge {
    height: 30px;
    border-radius: 50%;
    inset: auto auto calc(100% - 20px) calc(100% - 20px) !important;

    i.v-icon {
      font-size: 24px;
    }
  }
}
</style>
