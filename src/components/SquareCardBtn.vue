<template>
  <v-hover v-slot="{ hover }">
    <v-card
      v-ripple
      :elevation="hover ? 16 : 2"
      :class="{ 'on-hover': hover }"
      class="py-4 px-4"
      @click="onClick"
    >
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
