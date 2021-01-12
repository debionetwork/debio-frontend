<template>
  <div>
    <slot name="header"></slot>
    <div v-for="(item, key) in items" :key="key" class="label text-left mr-3 bri-text-body mb-1">
      <span :style="{width: longestLabelWidth + 'px'}">
        {{ item.title ? item.title : item.label }}
      </span> : <span class="text-secondary--text">{{ item.value }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoLabelValue',
  props: {
    /**
      Type item = { title|label: String|Number, value: String|Number }
    */
    items: [Array, Object]
  },
  data: () => ({
  }),
  computed: {
    longestLabelWidth() {
      const fontSize = 14;
      let longestLabelWidth = 120;
      for (let key in this.items) {
        const label = this.items[key]['label'] ? this.items[key]['label'] : this.items[key]['title']
        const labelWidth = label.length * (fontSize * 5/9)
        if (labelWidth > longestLabelWidth) {
          longestLabelWidth = labelWidth
        }
      }
      return longestLabelWidth
    },
  },
}
</script>

<style lang="scss" scoped>
.label {
  white-space: nowrap;
}
.label > span {
  display: inline-block;
}
</style>
