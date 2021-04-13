<template>
  <v-hover v-slot="{ hover }">
    <v-card
      class="my-1"
      :class="{ 'card-hover': hover }"
      @click="onClick"
      outlined
      style="border-radius: 10px;"
    >
      <div class="d-flex align-center">
        <div class="my-3 ml-5">
          <v-img v-bind:src="require('../assets/'+img)" width="48" />
          <!-- <v-icon
            :color="hover ? 'primary' : ''"
            :size="48"
          >
            {{ icon }}
          </v-icon> -->
        </div>
        
        <div>
          <div class="ml-10 text-left" :class="hover ? 'primary--text' : ''">
            {{ text }}
          </div>
          <div v-if="warning" class="ml-10 red--text" style="font-size: 14px;">
            {{ warning }}
          </div>
        </div>
      </div>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  name: 'LoginOptionBtn',
  props: {
    img: String,
    text: String,
    warning: String,
  },
  methods: {
    onClick() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
