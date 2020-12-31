<template>
  <v-hover v-slot="{ hover }">
    <v-card
      class="my-1 dg-menu-card"
      :class="{ 'card-hover': hover }"
      :elevation="hover ? 2 : 0"
      @click="onClick"
      outlined
      style="border-radius: 10px;"
    >
      <div class="d-flex align-center fill-height">
        <div class="my-3 ml-5">
          <v-icon
            v-if="icon"
            color="#BA8DBB"
            :size="48"
          >
            {{ icon }}
          </v-icon>
          <v-avatar v-else>
            <img src="../assets/degenics-logo.webp" />
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
    </v-card>
  </v-hover>
</template>

<script>
export default {
  name: 'MenuCard',
  props: {
    icon: String,
    title: String,
    subTitle: String,
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

