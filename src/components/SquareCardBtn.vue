<template>
  <v-hover v-slot="{ hover }">
    <v-card
      v-ripple
      :elevation="hover ? 16 : 2"
      :class="{ 'on-hover': hover }"
      class="py-4 px-4"
      @click="onClick"
      style="border-radius: 20px"
      :loading="loading"
    >
      <template slot="progress">
        <v-progress-linear color="red" :value="percentage"></v-progress-linear>
      </template>
      <v-responsive :aspect-ratio="1/1" class="d-flex align-center text-center">

        <slot>
        </slot>
      </v-responsive>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  name: 'SquareCardBtn',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    percentage: {
      type: Number,
      default: 0
    }
  },
  methods: {
    onClick() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss">
.on-hover {
  i {
    color: #F60689 !important;
  }
}
</style>
